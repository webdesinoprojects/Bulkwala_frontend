import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData || {};
  console.log("✅ Order Data from backend:", orderData);

  const paymentType = location.state?.paymentType || "Online Payment";

  const orderId = orderData?._id || "N/A";
  const totalAmount = orderData?.totalPrice || 0;
  const paymentStatus = orderData?.paymentStatus || "N/A";
  const itemCount = orderData?.products?.length || 0;
  const city = orderData?.shippingAddress?.city || "N/A";
  const customerName = orderData?.shippingAddress?.name || "N/A";
  const paymentMode = orderData?.paymentMode?.toUpperCase() || "N/A";
  const date = new Date(orderData?.createdAt).toLocaleDateString();

  // 🧾 Generate Invoice PDF
  const generateInvoice = () => {
    const doc = new jsPDF();

    // 🏷️ Header
    doc.setFontSize(18);
    doc.text("Awesome Accessories", 14, 20);
    doc.setFontSize(11);
    doc.text("GSTIN: 07AUEPJ8060D1ZT", 14, 26);
    doc.text("Email: support@bulkwala.com | Phone: 9310701078", 14, 31);
    doc.text(
      "Address: M-77, Block-M, Shyam Park, Uttam Nagar, New Delhi – 110059",
      14,
      36
    );

    doc.setFontSize(15);
    doc.text("Tax Invoice", 150, 20);
    doc.line(14, 38, 195, 38);

    // 🧾 Customer Info
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 46);
    doc.setFontSize(11);
    doc.text(`${customerName}`, 14, 52);
    if (paymentMode !== "PICKUP") {
      doc.text(`${orderData?.shippingAddress?.street || ""}`, 14, 57);
      doc.text(
        `${city}, ${orderData?.shippingAddress?.state || ""} - ${
          orderData?.shippingAddress?.postalCode || ""
        }`,
        14,
        62
      );
      doc.text(`Phone: ${orderData?.shippingAddress?.phone || ""}`, 14, 67);
    } else {
      doc.text("Pickup from Store – Uttam Nagar Delhi 110059", 14, 57);
    }

    doc.text(`Invoice No: ${orderId.slice(-6).toUpperCase()}`, 150, 46);
    doc.text(`Date: ${date}`, 150, 52);
    doc.text(`Payment Mode: ${paymentMode}`, 150, 57);
    doc.text(`Payment Status: ${paymentStatus.toUpperCase()}`, 150, 62);

    // 📦 Product Table
    const tableColumn = [
      "Product",
      "Qty",
      "GST Rate",
      "Taxable Value (₹)",
      "Total (₹)",
    ];
    const tableRows = [];

    orderData?.products?.forEach((item) => {
      const p = item?.product || {};
      const title = p.title || "Product";
      const qty = item?.quantity || 1;
      const total = (p.discountPrice || p.price || 0).toFixed(2);
      const gstRate = p.gstSlab ?? 18;
      const taxableValue = (
        (p.discountPrice || p.price || 0) /
        (1 + gstRate / 100)
      ).toFixed(2);

      tableRows.push([
        title,
        qty.toString(),
        `${gstRate}%`,
        taxableValue,
        total,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [30, 30, 30], textColor: 255 },
    });

    // 💰 Summary
    const summaryY = doc.lastAutoTable.finalY + 10;
    const itemsPrice = orderData?.itemsPrice || 0;
    const shipping = orderData?.shippingPrice || 0;
    const coupon = orderData?.couponDiscount || 0;
    const referral = orderData?.referralDiscount || 0;
    const flash = orderData?.flashDiscount || 0;
    const prepaid = orderData?.prepaidDiscount || 0;
    const grandTotal = orderData?.totalPrice || 0;

    const x = 130;
    let y = summaryY;

    doc.setFontSize(11);
    doc.text("Summary", 14, y);
    doc.setFontSize(10);
    doc.text(`Items Total: ₹${itemsPrice.toFixed(2)}`, x, (y += 6));
    doc.text(`Shipping: ₹${shipping.toFixed(2)}`, x, (y += 6));
    if (coupon > 0)
      doc.text(`Coupon Discount: -₹${coupon.toFixed(2)}`, x, (y += 6));
    if (referral > 0)
      doc.text(`Referral Discount: -₹${referral.toFixed(2)}`, x, (y += 6));
    if (flash > 0) doc.text(`Flash Offer: -₹${flash.toFixed(2)}`, x, (y += 6));
    if (prepaid > 0)
      doc.text(`Prepaid Discount: -₹${prepaid.toFixed(2)}`, x, (y += 6));

    doc.setFont(undefined, "bold");
    doc.text(`Grand Total (Inc GST): ₹${grandTotal.toFixed(2)}`, x, (y += 8));
    doc.setFont(undefined, "normal");

    // Footer
    doc.line(14, y + 4, 195, y + 4);
    doc.setFontSize(9);
    doc.text(
      "Thank you for shopping with Awesome Accessories – This is a computer-generated invoice.",
      14,
      y + 12
    );

    doc.save(`Invoice_${orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 text-center max-w-md sm:max-w-lg w-full">
        {/* ✅ Success Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <CheckCircle2 size={70} className="text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Thank you for your purchase! Your{" "}
          <span className="font-semibold">{paymentType}</span> order has been
          confirmed.
        </p>

        {/* 🧾 Order Info */}
        <div className="bg-gray-100 rounded-lg text-left p-3 sm:p-4 mb-6 text-gray-700 text-sm sm:text-base space-y-1">
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Customer:</strong> {customerName}
          </p>
          <p>
            <strong>Items:</strong> {itemCount}
          </p>
          <p>
            <strong>Payment Mode:</strong> {paymentMode}
          </p>
          <p>
            <strong>Payment Status:</strong> {paymentStatus.toUpperCase()}
          </p>
          <p>
            <strong>Shipping City:</strong> {city}
          </p>

          <hr className="my-2 border-gray-300" />

          <p>
            <strong>Items Total:</strong> ₹
            {orderData?.itemsPrice?.toFixed(2) || 0}
          </p>
          <p>
            <strong>Shipping:</strong> ₹
            {orderData?.shippingPrice?.toFixed(2) || 0}
          </p>
          <p>
            <strong>Tax (18%):</strong> ₹{orderData?.taxPrice?.toFixed(2) || 0}
          </p>

          {/* ✅ Show all discount lines */}
          {orderData?.couponDiscount > 0 && (
            <p className="text-green-700">
              <strong>Coupon Discount:</strong> -₹
              {orderData.couponDiscount.toFixed(2)}
            </p>
          )}
          {orderData?.referralDiscount > 0 && (
            <p className="text-purple-700">
              <strong>Referral Discount:</strong> -₹
              {orderData.referralDiscount.toFixed(2)}
            </p>
          )}
          {orderData?.flashDiscount > 0 && (
            <p className="text-blue-700">
              <strong>Flash Offer ({orderData.flashDiscountPercent}%):</strong>{" "}
              -₹
              {orderData.flashDiscount.toFixed(2)}
            </p>
          )}
          {orderData?.prepaidDiscount > 0 && (
            <p className="text-orange-700">
              <strong>Prepaid Discount:</strong> -₹
              {orderData.prepaidDiscount.toFixed(2)}
            </p>
          )}

          <p className="text-lg font-semibold text-gray-900 mt-2">
            Total Amount: ₹{totalAmount.toFixed(2)}
          </p>
        </div>

        {/* 🧾 Download Invoice */}
        <button
          onClick={generateInvoice}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition text-sm sm:text-base mb-3 sm:mb-4"
        >
          <Download size={18} />
          Download Invoice (PDF)
        </button>

        {/* 🧭 Navigation */}
        <button
          onClick={() => navigate("/my-orders")}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition text-sm sm:text-base"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-gray-600 hover:underline text-xs sm:text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
