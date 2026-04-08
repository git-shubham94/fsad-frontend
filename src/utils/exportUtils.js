import {jsPDF} from "jspdf";
import autoTable from 'jspdf-autotable';

// ─── EXPORT TO CSV ───────────────────────────────────────────
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export!');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (Array.isArray(value)) return `"${value.join(', ')}"`;
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return value ?? '';
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ─── EXPORT ACHIEVEMENTS TO PDF ──────────────────────────────
export const exportAchievementsToPDF = (achievements, students) => {
  if (!achievements || achievements.length === 0) {
    alert('No achievements to export!');
    return;
  }

  const doc = new jsPDF();

  // Header background
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 38, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Achievement Report', 14, 16);

  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 27);
  doc.text(`Total Achievements: ${achievements.length}`, 140, 27);

  // Divider line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(14, 33, 196, 33);

  // Table
  const tableData = achievements.map(a => {
    const student = students.find(s => s.id === a.studentId);
    return [
      student?.name || 'N/A',
      student?.rollNumber || 'N/A',
      student?.department || 'N/A',
      a.title,
      a.category?.charAt(0).toUpperCase() + a.category?.slice(1),
      a.activityCategory?.charAt(0).toUpperCase() + a.activityCategory?.slice(1) || 'N/A',
      new Date(a.date).toLocaleDateString('en-IN')
    ];
  });

  autoTable(doc, {
    startY: 45,
    head: [['Student Name', 'Roll No', 'Dept', 'Achievement Title', 'Category', 'Activity Type', 'Date']],
    body: tableData,
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [44, 62, 80]
    },
    alternateRowStyles: {
      fillColor: [245, 247, 255]
    },
    columnStyles: {
      3: { cellWidth: 50 }
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 4
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}  |  Student Achievement Management System`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`achievements_report_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
};

// ─── EXPORT PARTICIPATIONS TO PDF ────────────────────────────
export const exportParticipationsToPDF = (participations, students) => {
  if (!participations || participations.length === 0) {
    alert('No participation data to export!');
    return;
  }

  const doc = new jsPDF();

  // Header background
  doc.setFillColor(118, 75, 162);
  doc.rect(0, 0, 210, 38, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Participation Report', 14, 16);

  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 27);
  doc.text(`Total Records: ${participations.length}`, 140, 27);

  // Divider
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(14, 33, 196, 33);

  // Table
  const tableData = participations.map(p => {
    const student = students.find(s => s.id === p.studentId);
    return [
      student?.name || 'N/A',
      student?.rollNumber || 'N/A',
      student?.department || 'N/A',
      p.activityName,
      p.activityCategory?.charAt(0).toUpperCase() + p.activityCategory?.slice(1) || 'N/A',
      p.role,
      p.duration,
      Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || 'N/A'
    ];
  });

  autoTable(doc, {
    startY: 45,
    head: [['Student', 'Roll No', 'Dept', 'Activity', 'Category', 'Role', 'Duration', 'Skills']],
    body: tableData,
    headStyles: {
      fillColor: [118, 75, 162],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [44, 62, 80]
    },
    alternateRowStyles: {
      fillColor: [248, 245, 255]
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 4
    }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}  |  Student Achievement Management System`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`participations_report_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
};

// ─── EXPORT SINGLE STUDENT REPORT ────────────────────────────
export const exportStudentReportPDF = (student, achievements, participations) => {
  const doc = new jsPDF();

  // ── Header ──────────────────────────────────────────────────
  doc.setFillColor(102, 126, 234);
  doc.rect(0, 0, 210, 48, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Achievement Portfolio', 14, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${student.name}  |  ${student.rollNumber}  |  ${student.department}`, 14, 30);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 41);

  // Divider line inside header
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(14, 44, 196, 44);

  // ── Summary Section ─────────────────────────────────────────
  let currentY = 60;

  // Summary Box
  doc.setFillColor(245, 247, 255);
  doc.roundedRect(14, currentY - 8, 182, 28, 4, 4, 'F');

  doc.setTextColor(44, 62, 80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 20, currentY);
  currentY += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Total Achievements: ${achievements.length}`, 20, currentY);
  doc.text(`Total Participations: ${participations.length}`, 85, currentY);
  doc.text(`Awards: ${achievements.filter(a => a.category === 'award').length}`, 160, currentY);
  currentY += 20;

  // ── Achievements Table ───────────────────────────────────────
  if (achievements.length > 0) {
    // Section header bar
    doc.setFillColor(102, 126, 234);
    doc.rect(14, currentY - 2, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Achievements', 18, currentY + 5);
    currentY += 16;

    autoTable(doc, {
      startY: currentY,
      head: [['Title', 'Category', 'Activity Type', 'Date', 'Description']],
      body: achievements.map(a => [
        a.title,
        a.category?.charAt(0).toUpperCase() + a.category?.slice(1),
        a.activityCategory?.charAt(0).toUpperCase() + a.activityCategory?.slice(1) || 'N/A',
        new Date(a.date).toLocaleDateString('en-IN'),
        a.description
      ]),
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [245, 247, 255]
      },
      columnStyles: {
        0: { cellWidth: 45 },
        4: { cellWidth: 55 }
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 4
      }
    });

    currentY = doc.lastAutoTable.finalY + 18;
  }

  // ── Participations Table ─────────────────────────────────────
  if (participations.length > 0) {
    // Check if need new page
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    // Section header bar
    doc.setFillColor(118, 75, 162);
    doc.rect(14, currentY - 2, 182, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Participation History', 18, currentY + 5);
    currentY += 16;

    autoTable(doc, {
      startY: currentY,
      head: [['Activity', 'Category', 'Role', 'Duration', 'Skills']],
      body: participations.map(p => [
        p.activityName,
        p.activityCategory?.charAt(0).toUpperCase() + p.activityCategory?.slice(1) || 'N/A',
        p.role,
        p.duration,
        Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || 'N/A'
      ]),
      headStyles: {
        fillColor: [118, 75, 162],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [248, 245, 255]
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 4
      }
    });
  }

  // ── Footer on all pages ──────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer bar
    doc.setFillColor(240, 240, 250);
    doc.rect(0, doc.internal.pageSize.height - 16, 210, 16, 'F');

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i} of ${pageCount}  |  Student Achievement Management System  |  ${new Date().toLocaleDateString('en-IN')}`,
      14,
      doc.internal.pageSize.height - 6
    );
  }

  doc.save(`${student.name}_portfolio_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
};
