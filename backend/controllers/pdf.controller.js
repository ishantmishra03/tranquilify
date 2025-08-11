import PDFDocument from "pdfkit"; 
import MoodLog from "../models/mood.models.js";
import StressAssessment from "../models/stress.models.js"; 

export const generateMentalHealthPDF = async (req, res) => {
  try {
    const userId = req.userId;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const moodLogs = await MoodLog.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: 1 });
    const stressLogs = await StressAssessment.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: 1 });

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=mental-health-journal.pdf");
      res.send(pdfData);
    });

    doc.fontSize(24).text("Mental Health Journal | Tranquilify", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).fillColor("gray").text(`Generated on: ${new Date().toDateString()}`, { align: "right" });
    doc.moveDown();

   
    doc.fillColor("black").fontSize(18).text("Mood Logs", { underline: true });
    doc.moveDown(0.5);
    if (moodLogs.length === 0) {
      doc.fontSize(12).text("No mood data available in the last 7 days.");
    } else {
      moodLogs.forEach(m => {
        doc.fontSize(12).text(`• ${new Date(m.createdAt).toLocaleDateString()} - Mood: ${m.mood}`);
      });
    }

    doc.moveDown(2);

    
    doc.fontSize(18).fillColor("black").text("Stress Assessments", { underline: true });
    doc.moveDown(0.5);
    if (stressLogs.length === 0) {
      doc.fontSize(12).text("No stress data available in the last 7 days.");
    } else {
      stressLogs.forEach(s => {
        doc.fontSize(12).fillColor("black").text(`• ${new Date(s.createdAt).toLocaleDateString()} - Stress Level: ${s.stressLevel}/4`);
        
        
        if (s.symptoms && s.symptoms.length > 0) {
          doc.fontSize(11).fillColor("gray").text(`   • Symptoms: ${s.symptoms.join(", ")}`);
        }

        
        if (s.stressFactors && s.stressFactors.length > 0) {
          doc.fontSize(11).fillColor("gray").text(`   • Stress Factors: ${s.stressFactors.join(", ")}`);
        }

        doc.moveDown(0.5); 
      });
    }

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};
