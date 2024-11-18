"use strict";
// Define the test data as a global variable
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
const HORIZONTAL_PADDING = 100;
const VERTICAL_PADDING = 800; // Increased to accommodate larger text and spacing
const FRAMES_PER_ROW = 4;
const TEXT_PADDING = 60; // New constant for spacing between frame and text
// Always show the UI
figma.showUI(__html__, { width: 400, height: 500 });
figma.ui.onmessage = (msg) => {
    if (msg.type === "create-slides") {
        try {
            const content = msg.content;
            console.log("Received content:", content); // Add this line for debugging
            createSlides(content).catch((error) => {
                console.error("Error creating slides:", error);
                figma.closePlugin("An error occurred while creating slides.");
            });
        }
        catch (error) {
            console.error("Error processing content:", error);
            figma.closePlugin("Invalid content format. Please check your input.");
        }
    }
};
function createSlides(content) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load Inter font variants
        yield Promise.all([
            figma.loadFontAsync({ family: "Inter", style: "Regular" }),
            figma.loadFontAsync({ family: "Inter", style: "Medium" }),
            figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        ]);
        for (const [index, slide] of content.slides.entries()) {
            yield createSlide(slide, index);
        }
        // figma.closePlugin("Slides created successfully!");
    });
}
function createSlide(slide, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const row = Math.floor(index / FRAMES_PER_ROW);
        const col = index % FRAMES_PER_ROW;
        const frame = figma.createFrame();
        frame.resize(FRAME_WIDTH, FRAME_HEIGHT);
        frame.name = `Slide ${index + 1}`;
        frame.x = col * (FRAME_WIDTH + HORIZONTAL_PADDING);
        frame.y = row * (FRAME_HEIGHT + VERTICAL_PADDING);
        // Add background
        const bg = figma.createRectangle();
        bg.resize(FRAME_WIDTH, FRAME_HEIGHT);
        bg.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];
        frame.appendChild(bg);
        // Add VO text outside and underneath the frame
        const voText = createText(`${slide.title}`, frame.x, frame.y + FRAME_HEIGHT + TEXT_PADDING);
        voText.fontSize = 36;
        voText.textAlignHorizontal = "LEFT";
        voText.resize(FRAME_WIDTH, voText.height);
        // Add notes text below the VO text only if notes are specified
        if (slide.subtitle && slide.subtitle.trim() !== "") {
            const notesText = createText(`${slide.subtitle}`, frame.x, frame.y + FRAME_HEIGHT + voText.height + TEXT_PADDING * 2);
            notesText.fontSize = 36;
            notesText.textAlignHorizontal = "LEFT";
            notesText.resize(FRAME_WIDTH, notesText.height);
        }
    });
}
function createText(text, x, y) {
    const textNode = figma.createText();
    textNode.characters = text;
    textNode.fontName = { family: "Inter", style: "Regular" };
    textNode.fontSize = 48; // Doubled from 24
    textNode.x = x;
    textNode.y = y;
    return textNode;
}