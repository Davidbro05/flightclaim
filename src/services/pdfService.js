const PDFDocument = require('pdfkit');

function generatePowerOfAttorney(row, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=power_of_attorney_${row.id}.pdf`);
  doc.pipe(res);

  const companyName = process.env.COMPANY_NAME || 'FlightClaim AB';
  const companyReg = process.env.COMPANY_REG || 'XXXXXX-XXXX';
  const companyAddress = process.env.COMPANY_ADDRESS || 'Exempelgatan 1, 123 45 Stockholm';

  const getDisruptionText = (issue) => {
    const delayChecked = issue === 'delay' ? '☒' : '☐';
    const cancelledChecked = issue === 'cancelled' ? '☒' : '☐';
    const deniedChecked = issue === 'denied' ? '☒' : '☐';
    return `${delayChecked} Flight Delay\n${cancelledChecked} Flight Cancellation\n${deniedChecked} Denied Boarding`;
  };

  doc.fontSize(20).text('POWER OF ATTORNEY', { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(12).text(
    `I hereby authorize ${companyName}, company registration number ${companyReg}, ` +
    `with registered address ${companyAddress}, to represent me in my claim for compensation ` +
    `against the operating airline in accordance with EU Regulation 261/2004.`
  );
  doc.moveDown();

  doc.text(`This authorization grants ${companyName} the right to act on my behalf in all matters relating to my claim for compensation, including but not limited to:`);
  doc.moveDown(0.5);
  doc.text('• contacting the airline and other relevant parties');
  doc.text('• submitting and managing compensation claims');
  doc.text('• negotiating settlements');
  doc.text('• receiving correspondence related to the claim');
  doc.text('• receiving compensation payments on my behalf');
  doc.text('• initiating legal proceedings if necessary to enforce my rights');
  doc.moveDown();

  doc.text(`I understand that ${companyName} may charge a service fee according to the agreed terms and conditions.`);
  doc.moveDown(2);

  doc.fontSize(14).text('Passenger Information', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Full Name: ${row.namn}`);
  doc.text(`Address: ${row.street}, ${row.zip} ${row.city}`);
  doc.text(`Email Address: ${row.email}`);
  doc.text(`Phone Number: ${row.phone}`);
  doc.moveDown(2);

  doc.fontSize(14).text('Flight Information', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Airline: ${row.airline}`);
  doc.text(`Flight Number: ${row.flightNumber}`);
  doc.text(`Booking Reference (PNR): ${row.bookingReference || ''}`);
  doc.text(`Departure Airport: ${row.departureAirport}`);
  doc.text(`Arrival Airport: ${row.arrivalAirport}`);
  doc.text(`Flight Date: ${row.flightDate}`);
  doc.text('Type of Disruption:');
  doc.text(getDisruptionText(row.issue), { indent: 20 });
  doc.moveDown(2);

  doc.fontSize(14).text('Authorization', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(
    `By signing this document, I confirm that the information provided above is correct ` +
    `and that I authorize ${companyName} to represent me in my claim against the airline.`
  );
  doc.moveDown();
  doc.text('This authorization remains valid until the claim has been resolved or until it is revoked in writing.');
  doc.moveDown(2);

  doc.fontSize(14).text('Signature', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Passenger Name: ${row.namn}`);
  doc.text(`Place: ${row.city}`);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`);
  doc.moveDown();
  doc.text('Signature:');

  if (row.signature) {
    try {
      const base64Data = row.signature.split(',')[1];
      const imageBuffer = Buffer.from(base64Data, 'base64');
      doc.moveDown(0.5);
      doc.image(imageBuffer, { width: 200, height: 100 });
    } catch (e) {
      doc.text('(Signature could not be loaded)');
    }
  } else {
    doc.text('(No signature)');
  }

  doc.end();
}

module.exports = { generatePowerOfAttorney };
