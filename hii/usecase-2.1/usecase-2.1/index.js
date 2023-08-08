//program to calculate billiable employee
const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const PDFDocument = require("pdfkit");
function generateBillableEmployeeCSV(csvFilePath, outputFilePath) {
  // Define bill rates based on designation
  const billRates = {
    "Software Developer": 20,
    "Senior Software Developer": 25,
    "QA Engineer": 15,
    "DevOps Engineer": 30,
  };

  // Set billable hours per day
  const billableHoursPerDay = 8;

  // Read the data from the CSV file
  const employeeData = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      // Assuming the CSV file has columns: employeeID, name, designation, Billiable or Non-Billable
      const employeeID = row["Employee Id"];
      const name = row["Employee Name"];
      const designation = row["Designation"];
      const billable = row["Billiable or Non-Billable"];

      employeeData.push({ employeeID, name, designation, billable });
    })
    .on("end", () => {
      // Calculate total billable hours, non-billable hours, and total billable amount for each employee
      const billableEmployeeData = employeeData.map((employee) => {
        const totalWorkingDays = 20; // Assuming 20 working days in June
        const totalWorkingHours = billableHoursPerDay * totalWorkingDays;
        const billableHours =
          employee.billable === "Billiable" ? totalWorkingHours : 0;
        const nonBillableHours = totalWorkingHours - billableHours;
        const billRate = billRates[employee.designation];
        const totalBillableAmount = billableHours * billRate;

        return {
          employeeID: employee.employeeID,
          name: employee.name,
          designation: employee.designation,
          billable: employee.billable,
          totalWorkingHours,
          billableHours,
          nonBillableHours,
          billRate,
          totalBillableAmount,
        };
      });

      // Create the CSV file and write the data
      const csvHeaders =
        "Employee ID,Name,Designation,Billable,Total Working Hours,Billable Hours,Non-Billable Hours,Bill Rate,Total Billable Amount\n";
      const csvRows = billableEmployeeData
        .map(
          (employee) =>
            `${employee.employeeID},${employee.name},${employee.designation},${employee.billable},${employee.totalWorkingHours},${employee.billableHours},${employee.nonBillableHours},${employee.billRate},${employee.totalBillableAmount}`
        )
        .join("\n");
      const csvContent = csvHeaders + csvRows;

      fs.writeFile(outputFilePath, csvContent, "utf8", (err) => {
        if (err) {
          console.error("Error writing to CSV file:", err);
        } else {
          console.log(
            outputFilePath + " file has been generated successfully."
          );
          calculateProductivityAndAssignBonus(csvFilePath1, outputFilePath1);
        }
      });
    });
}

// Example usage:
const csvFilePath = "employee_designation.csv";
const outputFilePath = "billable_employee_june.csv";
generateBillableEmployeeCSV(csvFilePath, outputFilePath);

//productivity calculation
function calculateProductivityAndAssignBonus(csvFilePath, outputFilePath) {
  // Read the data from the CSV file
  const employeeData = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      // Assuming the CSV file has headers: Employee ID, Name, Designation, Billable, Total Working Hours, Billable Hours, Non-Billable Hours, Bill Rate, Total Billable Amount
      const employeeID = row["Employee ID"];
      const name = row["Name"];
      const designation = row["Designation"];
      const billable = row["Billable"];
      const totalWorkingHours = parseFloat(row["Total Working Hours"]);
      const billableHours = parseFloat(row["Billable Hours"]);
      const nonBillableHours = parseFloat(row["Non-Billable Hours"]);

      employeeData.push({
        employeeID,
        name,
        designation,
        billable,
        totalWorkingHours,
        billableHours,
        nonBillableHours,
      });
    })
    .on("end", () => {
      // Calculate productivity and assign bonuses
      const billableEmployees = employeeData.filter(
        (employee) => employee.billable === "Billiable"
      );
      const nonBillableEmployees = employeeData.filter(
        (employee) => employee.billable === "Non-Billable"
      );

      // Sort billable employees by total working hours and assign bonuses to the top 2
      billableEmployees.sort(
        (a, b) => b.totalWorkingHours - a.totalWorkingHours
      );
      const topBillableEmployees = billableEmployees.slice(0, 2);
      topBillableEmployees.forEach((employee) => {
        employee.bonus = 15000;
      });

      // Sort non-billable employees by total working hours and assign bonuses to the top 2
      nonBillableEmployees.sort(
        (a, b) => b.totalWorkingHours - a.totalWorkingHours
      );
      const topNonBillableEmployees = nonBillableEmployees.slice(0, 2);
      topNonBillableEmployees.forEach((employee) => {
        employee.bonus = 15000;
      });

      // Calculate productivity percentages for billable and non-billable employees
      const totalWorkingHours = employeeData.reduce(
        (sum, employee) => sum + employee.totalWorkingHours,
        0
      );
      const billableProductivity =
        (topBillableEmployees.reduce(
          (sum, employee) => sum + employee.billableHours,
          0
        ) /
          totalWorkingHours) *
        100;
      const nonBillableProductivity =
        (topNonBillableEmployees.reduce(
          (sum, employee) => sum + employee.nonBillableHours,
          0
        ) /
          totalWorkingHours) *
        100;

      // Prepare output data
      const outputData = employeeData.map((employee) => {
        const bonus = employee.bonus || "";
        return {
          "Employee ID": employee.employeeID,
          Name: employee.name,
          Designation: employee.designation,
          Billable: employee.billable,
          "Total Working Hours": employee.totalWorkingHours,
          "Billable Hours": employee.billableHours,
          "Non-Billable Hours": employee.nonBillableHours,
          Bonus: bonus,
        };
      });

      // Create the CSV file and write the data
      const csvHeaders = Object.keys(outputData[0]).join(",");
      const csvRows = outputData
        .map((employee) => Object.values(employee).join(","))
        .join("\n");
      const csvContent = csvHeaders + "\n" + csvRows;

      fs.writeFile(outputFilePath, csvContent, (err) => {
        if (err) {
          console.error("Error writing output file:", err);
        } else {
          console.log("Output file written successfully!");
          calculatePayroll("June", 2023, csvFilePath2);
        }
      });

      // Display results
      console.log("Billable Employees:");
      topBillableEmployees.forEach((employee) => {
        console.log(
          `ID: ${employee.employeeID}, Name: ${employee.name}, Designation: ${employee.designation}, Billable Hours: ${employee.billableHours}`
        );
      });
      console.log(
        "Billable Productivity:",
        billableProductivity.toFixed(2) + "%"
      );

      console.log("\nNon-Billable Employees:");
      topNonBillableEmployees.forEach((employee) => {
        console.log(
          `ID: ${employee.employeeID}, Name: ${employee.name}, Designation: ${employee.designation}, Non-Billable Hours: ${employee.nonBillableHours}`
        );
      });
      console.log(
        "Non-Billable Productivity:",
        nonBillableProductivity.toFixed(2) + "%"
      );
    });
}

// Example usage:
const csvFilePath1 = "billable_employee_june.csv";
const outputFilePath1 = "output.csv";

//payroll calculation
// Function to calculate payroll for a month
function calculatePayroll(month, year, csvFilePath) {
  // Define tax rates and other constants
  const taxRate = 0.2; // 20% tax rate
  const maxWorkingHours = 176; // Maximum working hours in a month

  // Read the employee data from the CSV file
  const employeeData = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      const name = row["Employee Name"];
      const id = row["Employee Id"];
      const designation = row["Designation"];
      const billable = row["Billiable or Non-Billable"];

      employeeData.push({
        name,
        id,
        designation,
        billable,
      });
    })
    .on("end", () => {
      // Calculate payroll for each employee
      const payrollData = employeeData.map((employee) => {
        const monthlySalary = calculateMonthlySalary(employee.designation);
        const taxAmount = monthlySalary * taxRate;
        const netSalary = monthlySalary - taxAmount;

        return {
          name: employee.name,
          id: employee.id,
          month: month,
          year: year,
          designation: employee.designation,
          monthlySalary: monthlySalary,
          taxAmount: taxAmount,
          netSalary: netSalary,
        };
      });

      // Store payroll data in emp_payroll_cal.csv
      const outputFilePath = "emp_payroll_cal.csv";
      const csvWriter = createCsvWriter({
        path: outputFilePath,
        header: [
          { id: "name", title: "Employee Name" },
          { id: "id", title: "Employee Id" },
          { id: "month", title: "Month" },
          { id: "year", title: "Year" },
          { id: "designation", title: "Designation" },
          { id: "monthlySalary", title: "Monthly Salary" },
          { id: "taxAmount", title: "Tax Amount" },
          { id: "netSalary", title: "Net Salary" },
        ],
      });
      csvWriter
        .writeRecords(payrollData)
        .then(() => {
          console.log(`Payroll data written to ${outputFilePath}`);
          calculateActualPayroll(
            employeeProductivityFile,
            employeePayrollFile,
            employeeAttendanceFile
          );
        })
        .catch((error) => {
          console.error("Error writing payroll data:", error);
        });
    });

  // Function to calculate monthly salary based on designation
  function calculateMonthlySalary(designation) {
    // Define salary ranges based on designation
    const salaryRanges = {
      "Software Developer": { min: 50000, max: 80000 },
      "Senior Software Developer": { min: 80001, max: 100000 },
      "QA Engineer": { min: 30000, max: 30000 },
      "DevOps Engineer": { min: 25000, max: 25000 },
    };

    const salaryRange = salaryRanges[designation];
    if (salaryRange) {
      return getRandomNumber(salaryRange.min, salaryRange.max);
    } else {
      return 0;
    }
  }

  // Function to generate a random number within a range
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Example usage:
const csvFilePath2 = "employee_designation.csv";

//final payroll
function calculateActualPayroll(
  employeeProductivityFile,
  employeePayrollFile,
  employeeAttendanceFile
) {
  // Read employee productivity data
  const employeeProductivityData = [];
  fs.createReadStream(employeeProductivityFile)
    .pipe(csv())
    .on("data", (row) => {
      const employeeID = row["Employee ID"];
      const name = row["Name"];
      const designation = row["Designation"];
      const billable = row["Billable"];
      const totalWorkingHours = parseFloat(row["Total Working Hours"]);
      const billableHours = parseFloat(row["Billable Hours"]);
      const nonBillableHours = parseFloat(row["Non-Billable Hours"]);
      const bonus = parseFloat(row["Bonus"]) || 0;

      employeeProductivityData.push({
        employeeID,
        name,
        designation,
        billable,
        totalWorkingHours,
        billableHours,
        nonBillableHours,
        bonus,
      });
    })
    .on("end", () => {
      // Read employee payroll data
      const employeePayrollData = [];
      fs.createReadStream(employeePayrollFile)
        .pipe(csv())
        .on("data", (row) => {
          const name = row["Employee Name"];
          const id = row["Employee Id"];
          const month = row["Month"];
          const year = row["Year"];
          const designation = row["Designation"];
          const monthlySalary = parseFloat(row["Monthly Salary"]);
          const taxAmount = parseFloat(row["Tax Amount"]);
          const netSalary = parseFloat(row["Net Salary"]);

          employeePayrollData.push({
            name,
            id,
            month,
            year,
            designation,
            monthlySalary,
            taxAmount,
            netSalary,
          });
        })
        .on("end", () => {
          // Read employee attendance data
          const employeeAttendanceData = [];
          fs.createReadStream(employeeAttendanceFile)
            .pipe(csv())
            .on("data", (row) => {
              const name = row["Employee Name"];
              const id = row["Employee Id"];
              const totalWorkingDay = parseInt(row["Total Working Day"]);
              const totalWorkingHours = parseFloat(row["Total Working Hours"]);

              employeeAttendanceData.push({
                name,
                id,
                totalWorkingDay,
                totalWorkingHours,
              });
            })
            .on("end", () => {
              // Calculate actual payroll for each employee
              const actualPayrollData = employeePayrollData.map((payroll) => {
                const employeeProductivity = employeeProductivityData.find(
                  (productivity) =>
                    productivity.name === payroll.name &&
                    productivity.employeeID === payroll.id &&
                    productivity.designation === payroll.designation
                );

                const employeeAttendance = employeeAttendanceData.find(
                  (attendance) =>
                    attendance.name === payroll.name &&
                    attendance.id === payroll.id
                );

                let bonus = 0;
                if (employeeProductivity) {
                  bonus = employeeProductivity.bonus || 0;
                }

                const actualNetSalary = payroll.netSalary + bonus;

                return {
                  name: payroll.name,
                  id: payroll.id,
                  month: payroll.month,
                  year: payroll.year,
                  designation: payroll.designation,
                  monthlySalary: payroll.monthlySalary,
                  taxAmount: payroll.taxAmount,
                  netSalary: payroll.netSalary,
                  bonus: bonus,
                  actualNetSalary: actualNetSalary,
                };
              });

              // Store actual payroll data in employee_result_payroll.csv
              const outputFilePath = "employee_result_payroll.csv";
              const csvWriter = createCsvWriter({
                path: outputFilePath,
                header: [
                  { id: "name", title: "Employee Name" },
                  { id: "id", title: "Employee Id" },
                  { id: "month", title: "Month" },
                  { id: "year", title: "Year" },
                  { id: "designation", title: "Designation" },
                  { id: "monthlySalary", title: "Monthly Salary" },
                  { id: "taxAmount", title: "Tax Amount" },
                  { id: "netSalary", title: "Net Salary" },
                  { id: "bonus", title: "Bonus" },
                  { id: "actualNetSalary", title: "Actual Net Salary" },
                ],
              });

              csvWriter
                .writeRecords(actualPayrollData)
                .then(() => {
                  console.log(
                    `Actual payroll data written to ${outputFilePath}`
                  );
                  generatePayslipPDFs(payrollFile);
                })
                .catch((error) => {
                  console.error("Error writing actual payroll data:", error);
                });
            });
        });
    });
}

// Example usage:
const employeeProductivityFile = "output.csv";
const employeePayrollFile = "emp_payroll_cal.csv";
const employeeAttendanceFile = "emp_result_june.csv";

//final Payroll
// Function to generate payslip PDF for each employee
function generatePayslipPDFs(payrollFile) {
  fs.createReadStream(payrollFile)
    .pipe(csv())
    .on("data", (row) => {
      const name = row["Employee Name"];
      const payslipData = {
        EmployeeName: row["Employee Name"],
        EmployeeId: row["Employee Id"],
        Month: row["Month"],
        Year: row["Year"],
        Designation: row["Designation"],
        MonthlySalary: row["Monthly Salary"],
        TaxAmount: row["Tax Amount"],
        NetSalary: row["Net Salary"],
        Bonus: row["Bonus"],
        ActualNetSalary: row["Actual Net Salary"],
      };

      generatePayslipPDF(name, payslipData);
    })
    .on("end", () => {
      console.log("Payslip PDFs generated successfully.");
    });
}

// Function to generate payslip PDF for a single employee
function generatePayslipPDF(employeeName, payslipData) {
  const {
    EmployeeName,
    EmployeeId,
    Month,
    Year,
    Designation,
    MonthlySalary,
    TaxAmount,
    NetSalary,
    Bonus,
    ActualNetSalary,
  } = payslipData;

  const document = new PDFDocument();

  // Set the document title
  document.info.Title = `${EmployeeName} - Payslip`;

  // Generate a unique filename for each employee
  const outputFilePath = `${employeeName}_Payslip.pdf`;

  // Pipe the document content to a writable stream (here, a PDF file)
  document.pipe(fs.createWriteStream(outputFilePath));

  // Add content to the document
  document.fontSize(16).text("Payslip", { align: "center" });
  document
    .fontSize(12)
    .text("Kellton Tech Solution Pvt Ltd.", { align: "center" });
  document.moveDown();
  document.fontSize(12).text(`Employee Name: ${EmployeeName}`);
  document.fontSize(12).text(`Employee ID: ${EmployeeId}`);
  document.fontSize(12).text(`Month: ${Month}`);
  document.fontSize(12).text(`Year: ${Year}`);
  document.moveDown();
  document.fontSize(12).text(`Designation: ${Designation}`);
  document.fontSize(12).text(`Monthly Salary: ${MonthlySalary}`);
  document.fontSize(12).text(`Tax Amount: ${TaxAmount}`);
  document.fontSize(12).text(`Net Salary: ${NetSalary}`);
  document.fontSize(12).text(`Bonus: ${Bonus}`);
  document.fontSize(12).text(`Actual Net Salary: ${ActualNetSalary}`);

  // Finalize the document
  document.end();
}

// Example usage:
const payrollFile = "employee_result_payroll.csv";
