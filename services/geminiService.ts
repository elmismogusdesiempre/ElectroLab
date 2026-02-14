import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ComponentData, Wire } from '../types';

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

// Tool Definition for Circuit Generation
const layoutCircuitTool: FunctionDeclaration = {
  name: "layoutCircuit",
  description: "Build a new electronic circuit by placing components and wires on the board.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      explanation: {
        type: Type.STRING,
        description: "A brief explanation of the circuit being built."
      },
      components: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Temporary unique ID (e.g. c1)" },
            type: { type: Type.STRING, description: "Component Type: RESISTOR, CAPACITOR, LED, VOLTAGE_SOURCE, GROUND, SWITCH, AND_GATE, OR_GATE, NOT_GATE, MICROCONTROLLER" },
            x: { type: Type.NUMBER, description: "X Position (approx 0-800)" },
            y: { type: Type.NUMBER, description: "Y Position (approx 0-600)" },
            rotation: { type: Type.NUMBER, description: "Rotation (0, 90, 180, 270)" },
            properties: { 
                type: Type.OBJECT, 
                properties: {
                    bands: { type: Type.ARRAY, items: { type: Type.STRING } },
                    isOpen: { type: Type.BOOLEAN },
                    isOn: { type: Type.BOOLEAN }
                }
            }
          },
          required: ["id", "type", "x", "y"]
        }
      },
      wires: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            fromCompId: { type: Type.STRING },
            fromPinId: { type: Type.STRING },
            toCompId: { type: Type.STRING },
            toPinId: { type: Type.STRING }
          },
          required: ["fromCompId", "fromPinId", "toCompId", "toPinId"]
        }
      }
    },
    required: ["components", "wires", "explanation"]
  }
};

export const analyzeCircuit = async (components: ComponentData[], wires: Wire[], query: string): Promise<{ text: string, circuit?: any }> => {
  const ai = getClient();
  if (!ai) return { text: "Error: API Key not found. Please ensure the environment is configured correctly." };

  const circuitDescription = JSON.stringify({
    components: components.map(c => ({ 
      type: c.type, 
      id: c.id, 
      properties: c.properties,
      x: c.x,
      y: c.y,
    })),
    wires: wires.length
  });

  const systemInstruction = `
    You are an expert electronics professor and lab assistant.
    
    Your Capabilities:
    1. Answer questions about the current circuit.
    2. BUILD or DESIGN circuits if the student asks (e.g., "Build a high pass filter", "Create a voltage divider", "Add a switch and LED").
    
    When building a circuit, use the 'layoutCircuit' tool.
    
    Technical Reference:
    - Grid: 20px steps. Center of screen is approx 400,300. Place components nicely spaced.
    - Valid Pin IDs per Component:
      * Resistor, Capacitor: p1, p2
      * LED: anode, cathode
      * VoltageSource: pos, neg
      * Ground: gnd
      * Switch: in, out
      * AND/OR Gate: in1, in2, out
      * NOT Gate: in, out
      * Microcontroller: vcc, gnd, p0, p1, p2, p3
    
    Current Board State:
    ${circuitDescription}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ functionDeclarations: [layoutCircuitTool] }]
      }
    });

    const call = response.functionCalls?.[0];
    if (call && call.name === 'layoutCircuit') {
        const args = call.args as any;
        return {
            text: args.explanation || "Circuit created as requested.",
            circuit: {
                components: args.components,
                wires: args.wires
            }
        };
    }

    return { text: response.text || "I couldn't generate a response." };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "An error occurred while consulting the AI Lab Assistant." };
  }
};
