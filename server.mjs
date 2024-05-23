import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import parser from "./src/parser.js";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const talentPath = path.join(__dirname, "./src/data/talent.json");
const templatePath = path.join(__dirname, "./src/template/cv.template.html");
const editableTemplatePath = path.join(
  __dirname,
  "./src/template/cv.editable.template.html"
);
const viewTemplatePath = path.join(
  __dirname,
  "./src/template/cv.view.template.html"
);
const exportTemplatePath = path.join(
  __dirname,
  "./src/template/cv.export.template.html"
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const talentData = JSON.parse(fs.readFileSync(talentPath, "utf-8"));
  const body = ejs.render(
    fs.readFileSync(viewTemplatePath, "utf-8"),
    talentData
  );
  const html = ejs.render(fs.readFileSync(templatePath, "utf-8"), {
    body,
    editable: false,
  });
  res.send(html);
});

app.get("/edit", (req, res) => {
  const talentData = JSON.parse(fs.readFileSync(talentPath, "utf-8"));
  const body = ejs.render(
    fs.readFileSync(editableTemplatePath, "utf-8"),
    talentData
  );
  const html = ejs.render(fs.readFileSync(templatePath, "utf-8"), {
    body,
    editable: true,
  });
  res.send(html);
});

app.post("/update", (req, res) => {
  const updatedData = req.body;
  console.log("Received Data:", updatedData); // Debugging: Print received data

  try {
    // Construct the data object
    const data = parser(updatedData);

    console.log("Parsed Data:", data); // Debugging: Print parsed data

    fs.writeFile(talentPath, JSON.stringify(data, null, 2), "utf-8", (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to save data" });
      }
      return res.json({ success: true, message: "Data saved successfully" });
    });
  } catch (error) {
    console.error("Error parsing data", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to parse data" });
  }
});

app.get("/download", async (req, res) => {
  try {
    const talentData = JSON.parse(fs.readFileSync(talentPath, "utf-8"));
    const body = ejs.render(
      fs.readFileSync(viewTemplatePath, "utf-8"),
      talentData
    );
    const htmlContent = ejs.render(
      fs.readFileSync(exportTemplatePath, "utf-8"),
      {
        body,
        editable: false,
      }
    );

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF from HTML content
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      // Here add the padding to the pdf pages
      margin: {
        top: "1in",
        bottom: "1in",
        left: "1in",
        right: "1in",
      },
    });

    await browser.close();

    // Set the response headers and send the PDF buffer
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="download.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
