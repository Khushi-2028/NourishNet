import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";

/*
====================================================
HELPER
====================================================
*/

const value = (v) => {
    if (v === undefined || v === null || v === "")
        return "-";

    if (Array.isArray(v))
        return v.join(", ");

    return String(v);
};
/*
====================================================
ABSOLUTE IMAGE PATH
====================================================
*/
const getAbsoluteImagePath = (imgPath) => {

    if (!imgPath) return null;

    const clean = imgPath.replace(/^\/+/, "");

    const cwd = process.cwd();

    const possiblePaths = [

        // Delivery proof images
        path.join(cwd, clean),

        // Donation images
        path.join(cwd, "src", clean),

        // Optional fallbacks
        path.join(cwd, "..", clean),
        path.join(cwd, "..", "server", "src", clean)

    ];

    for (const p of possiblePaths) {

        console.log("Checking:", p);

        if (fs.existsSync(p)) {

            console.log("Found:", p);

            return p;

        }

    }

    console.log("Image NOT found:", clean);

    return null;

};


/*
====================================================
PDF
====================================================
*/

export const generatePDF = async (data, title) => {

    const doc = new PDFDocument({
        margin: 40,
        size: "A4"
    });

    const buffers = [];

    doc.on("data", chunk => buffers.push(chunk));

    return new Promise(resolve => {

        doc.on("end", () => {

            resolve(Buffer.concat(buffers));

        });

        /*
        ===========================================
        TITLE
        ===========================================
        */

        doc
            .fontSize(22)
            .fillColor("#f97316")
            .text("NourishNet");

        doc
            .moveDown(0.3);

        doc
            .fontSize(18)
            .fillColor("black")
            .text(title);

        doc
            .fontSize(10)
            .fillColor("gray")
            .text(`Generated: ${new Date().toLocaleString()}`);

        doc.moveDown();

        /*
        ===========================================
        RECORDS
        ===========================================
        */

        data.forEach((item, index) => {

            doc
                .fontSize(14)
                .fillColor("#0f172a")
 .text(`${index + 1}. ${item["Donation Title"] ||item.Title ||"Record"}`);          

            doc.moveDown(0.4);

            /*
            IMAGE
            */
if (item.imagePath) {

    try {

        const image = getAbsoluteImagePath(item.imagePath);
        console.log("Trying image:", image);
console.log("Exists:", fs.existsSync(image));
        if (image && fs.existsSync(image)) {

            doc.image(image, {

                fit: [180,140],

                align: "center"

            });

            doc.moveDown();

        }

    } catch (err) {

        console.log(err.message);

    }

}
           

            /*
            ALL FIELDS
            */

            Object.entries(item).forEach(([key, val]) => {

                if (
    key === "imagePath" ||
    key === "Image"
)
    return;

                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
.fillColor("#111827")
.text(`${key}: `, {continued: true});

doc.font("Helvetica")
.fillColor("#374151").text(value(val));});
doc.moveDown();
doc.strokeColor("#d1d5db")
.moveTo(40, doc.y)
 .lineTo(555, doc.y).stroke();
doc.moveDown();});doc.end();});};

//EXCEL
export const generateExcel = async (data) => {
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Report");
if (!data.length)
return await workbook.xlsx.writeBuffer();
 const headers = Object.keys(data[0]).filter(
    key =>
        key !== "imagePath" &&
        key !== "Image"
);

sheet.columns = headers.map(key => ({
    header: key,
    key,
    width: Math.max(20, key.length + 5)
}));

//HEADER STYLE
sheet.getRow(1).font = {
bold: true,
color: {argb: "FFFFFFFF"}};
sheet.getRow(1).fill = {
type: "pattern",
pattern: "solid",fgColor: {argb: "F97316"}};  
//DATA
  const imageColumn = sheet.columnCount + 1;

 sheet.getCell(1, imageColumn).value = "Image";

sheet.getColumn(imageColumn).width = 20;
for (const item of data) {

    const row = {};

    Object.keys(item).forEach(key => {

        if (key === "imagePath")
            return;

        row[key] = value(item[key]);

    });

    const addedRow = sheet.addRow(row);

    if (item.imagePath) {

        try {

            const image = getAbsoluteImagePath(item.imagePath);

            if (image && fs.existsSync(image)) {

                const extension = path.extname(image).replace(".", "");

                const imageId = workbook.addImage({

                    filename: image,

                    extension

                });

                sheet.addImage(imageId, {

                    tl: {

                        col: imageColumn - 1,

                        row: addedRow.number - 1

                    },

                    ext: {

                        width: 90,

                        height: 90

                    }

                });

                addedRow.height = 70;

            }

        }

        catch {}

    }

}
sheet.columns.forEach(column => {

    const header = column.header
        ? String(column.header)
        : "";

    let max = header.length;

    column.eachCell(cell => {

        max = Math.max(
            max,
            value(cell.value).length
        );

    });

    column.width = Math.min(max + 4, 45);

});

return await workbook.xlsx.writeBuffer();};

//CSV
export const generateCSV = (data) => {

    const cleaned = data.map(item => {

        const row = {};

        Object.keys(item).forEach(key => {

            if (key === "imagePath"|| key === "Image")
                return;

            if (key === "Image")
                return;

            row[key] = value(item[key]);

        });

        return row;

    });

    const parser = new Parser();

    return parser.parse(cleaned);

};