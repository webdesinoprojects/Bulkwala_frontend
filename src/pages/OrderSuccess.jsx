import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ fixed import

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData || {};
  const paymentType = location.state?.paymentType || "Online Payment";

  const orderId = orderData?._id || "N/A";
  const totalAmount = orderData?.totalPrice || 0;
  const paymentStatus = orderData?.paymentStatus || "N/A";
  const itemCount = orderData?.products?.length || 0;
  const city = orderData?.shippingAddress?.city || "N/A";
  const customerName = orderData?.shippingAddress?.name || "N/A";
  const paymentMode = orderData?.paymentMode?.toUpperCase() || "N/A";
  const date = new Date(orderData?.createdAt).toLocaleDateString();

  const items = orderData?.products || [];

  // 🧾 Generate Invoice PDF
  const generateInvoice = () => {
    console.log("🧾 Generating Invoice...");

    const doc = new jsPDF();

    // 🏢 Company Header
    doc.setFontSize(18);
    doc.text("Bulkwala Pvt. Ltd.", 14, 20);
    doc.setFontSize(11);
    doc.text("GSTIN: 07ABCDE1234F1Z9", 14, 26);
    doc.text("Email: support@bulkwala.com | Phone: +91 98765 43210", 14, 31);
    doc.text(
      "Address: A-98, 2nd Floor, Jain Park, Uttam Nagar, Delhi 110059",
      14,
      36
    );

    // 📦 Invoice Title
    doc.setFontSize(15);
    doc.text("Invoice / Tax Invoice", 150, 20);
    doc.setLineWidth(0.5);
    doc.line(14, 38, 195, 38);

    // 🧍 Customer Info
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 46);
    doc.setFontSize(11);
    doc.text(`${customerName}`, 14, 52);
    doc.text(`${orderData?.shippingAddress?.street || ""}`, 14, 57);
    doc.text(
      `${city}, ${orderData?.shippingAddress?.state || ""} - ${
        orderData?.shippingAddress?.postalCode || ""
      }`,
      14,
      62
    );
    doc.text(`Phone: ${orderData?.shippingAddress?.phone || ""}`, 14, 67);

    // 🧾 Invoice Meta Info
    doc.text(`Invoice No: ${orderId.slice(-6).toUpperCase()}`, 150, 46);
    doc.text(`Date: ${date}`, 150, 52);
    doc.text(`Payment Mode: ${paymentMode}`, 150, 57);
    doc.text(`Payment Status: ${paymentStatus.toUpperCase()}`, 150, 62);

    // 🛍️ Items Table
    const tableColumn = ["Product", "Qty", "Price (₹)", "Subtotal (₹)"];
    const tableRows = [];

    orderData?.products?.forEach((item) => {
      // Handle both populated & raw product cases
      const title =
        item?.product?.title ||
        item?.title ||
        item?.productName ||
        "Unknown Product";

      const price = item?.product?.price || item?.priceAtPurchase || 0;

      const subtotal = (price * (item?.quantity || 1)).toFixed(2);

      tableRows.push([
        title,
        item?.quantity?.toString() || "1",
        price.toFixed(2),
        subtotal,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [32, 32, 32], textColor: 255 },
    });

    // 🧮 Price Summary
    const summaryY = doc.lastAutoTable.finalY + 10;
    const itemsPrice = orderData?.itemsPrice || totalAmount / 1.18;
    const taxPrice = orderData?.taxPrice || totalAmount - itemsPrice;
    const shippingPrice = orderData?.shippingPrice || 0;

    doc.setFontSize(11);
    doc.text("Price Summary:", 14, summaryY);
    doc.text(`Items Total: ₹${itemsPrice.toFixed(2)}`, 150, summaryY);
    doc.text(`Tax (18%): ₹${taxPrice.toFixed(2)}`, 150, summaryY + 6);
    doc.text(`Shipping: ₹${shippingPrice.toFixed(2)}`, 150, summaryY + 12);
    doc.setFont(undefined, "bold");
    doc.text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 150, summaryY + 18);
    doc.setFont(undefined, "normal");

    // 💬 Footer
    doc.line(14, summaryY + 30, 195, summaryY + 30);
    doc.setFontSize(10);
    doc.text(
      "Thank you for shopping with Bulkwala! This is a computer-generated invoice.",
      14,
      summaryY + 38
    );

    // 💾 Save File
    doc.save(`Invoice_${orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-lg w-full">
        {/* ✅ Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={80} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your{" "}
          <span className="font-semibold">{paymentType}</span> order has been
          confirmed.
        </p>

        {/* 🧾 Order Info */}
        <div className="bg-gray-100 rounded-lg text-left p-4 mb-6 text-gray-700 space-y-1">
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Customer:</strong> {customerName}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{totalAmount}
          </p>
          <p>
            <strong>Items:</strong> {itemCount}
          </p>
          <p>
            <strong>Payment Status:</strong> {paymentStatus.toUpperCase()}
          </p>
          <p>
            <strong>Payment Mode:</strong> {paymentMode}
          </p>
          <p>
            <strong>Shipping City:</strong> {city}
          </p>
        </div>

        {/* 🧾 Download Invoice Button */}
        <button
          onClick={generateInvoice}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition mb-4"
        >
          <Download size={18} />
          Download Invoice (PDF)
        </button>

        {/* 🧭 Navigation */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-gray-600 hover:underline text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
