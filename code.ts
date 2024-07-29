// Define the test data as a global variable
const testData = {
  slides: [
    {
      title: "Test Slide 1",
      type: "graph",
      vo: "This is a test note for slide 1",
      notes: "This is a test note for slide 1",
    },
    {
      title: "Test Slide 2",
      type: "chart",
      vo: "This is a test note for slide 2",
      notes: "This is a test note for slide 2",
    },
    {
      title: "Test Slide 3",
      type: "image",
      vo: "This is a test note for slide 3",
      notes: "This is a test note for slide 3",
    },
  ],
};

interface Slide {
  title: string;
  type: string;
  vo: string;
  notes: string;
}

interface SlidesInput {
  slides: Slide[];
}

const yPadding = 100;
const dev = true;

// Comment out the UI show command for development
if (dev) {
  createSlides(testData as SlidesInput).catch((error) => {
    console.error("Error creating slides:", error);
    figma.closePlugin("An error occurred while creating slides.");
  });
} else {
  figma.showUI(__html__, { width: 400, height: 500 });
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-slides") {
    createSlides(msg.content).catch((error) => {
      console.error("Error creating slides:", error);
      figma.closePlugin("An error occurred while creating slides.");
    });
  }
};

async function createSlides(content: SlidesInput) {
  // Load Inter font variants
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);

  for (const [index, slide] of content.slides.entries()) {
    await createSlide(slide, index);
  }

  figma.closePlugin("Slides created successfully!");
}

async function createSlide(slide: Slide, index: number) {
  const frame = figma.createFrame();
  frame.resize(1920, 1080);
  frame.name = slide.title;
  frame.x = 0;
  frame.y = index * (1080 + yPadding);

  // Add background
  const bg = figma.createRectangle();
  bg.resize(1920, 1080);
  bg.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];
  frame.appendChild(bg);

  // Add placeholder for main content based on type
  const content = figma.createRectangle();
  content.resize(1720, 700);
  content.x = 100;
  content.y = 150;
  content.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(content);

  // Add text to indicate content type
  const textNode = createText(
    `Placeholder for ${slide.type}`,
    frame,
    content.x + content.width / 2,
    content.y + content.height / 2
  );
  frame.appendChild(textNode);

  const voX = content.x - 500;
  const voY = frame.y + frame.height / 2;
  const voText = createText(slide.vo, frame, voX, voY);
  const notesText = createText(slide.notes, frame, voX, voY);
}

function createText(text: string, frame: FrameNode, x: number, y: number) {
  const textNode = figma.createText();
  textNode.characters = text;
  textNode.fontName = { family: "Inter", style: "Regular" };
  textNode.fontSize = 24;
  textNode.x = x;
  textNode.y = y;
  // Center the text horizontally and vertically
  textNode.textAlignHorizontal = "CENTER";
  textNode.textAlignVertical = "CENTER";

  // Adjust the position to account for centering
  textNode.x = x - textNode.width / 2;
  textNode.y = y - textNode.height / 2;
  return textNode;
}
