import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { FaFileExport } from "react-icons/fa";

export default function UsersContent() {
  const allUsers = useAuthStore((s) => s.allUsers);
  const fetchAllUsers = useAuthStore((s) => s.fetchAllUsers);
  const approveSeller = useAuthStore((s) => s.approveSeller);
  const rejectSeller = useAuthStore((s) => s.rejectSeller);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const badgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-green-100 text-green-700";
      case "seller":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const exportToCSV = () => {
    if (!allUsers || allUsers.length === 0) {
      toast.error("No users to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Business Name",
      "GST Number",
      "Pickup Address",
      "Bank Name",
      "Account Number",
      "IFSC",
      "Seller Status",
      "Is Verified",
      "Created At",
    ];

    // Convert users data to CSV rows
    const rows = allUsers.map((user) => [
      user.name || "",
      user.email || "",
      user.phone || "",
      user.role || "",
      user.sellerDetails?.businessName || "",
      user.sellerDetails?.gstNumber || "",
      user.sellerDetails?.pickupAddress || "",
      user.sellerDetails?.bankName || "",
      user.sellerDetails?.accountNumber || "",
      user.sellerDetails?.ifsc || "",
      user.sellerDetails?.approved ? "Approved" : user.sellerDetails?.businessName ? "Pending" : "N/A",
      user.isVerified ? "Yes" : "No",
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma, newline, or quote
            const cellStr = String(cell).replace(/"/g, '""');
            return /[",\n]/.test(cellStr) ? `"${cellStr}"` : cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bulkwala_users_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${allUsers.length} users successfully`);
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#02066F]">All Users</CardTitle>
            <CardDescription>Manage users and sellers</CardDescription>
          </div>
          <Button
            onClick={exportToCSV}
            className="bg-[#02066F] hover:bg-[#04127A] text-white"
            disabled={!allUsers || allUsers.length === 0 || isLoading}
          >
            <FaFileExport className="mr-2" />
            Export to CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading users...</p>
        ) : allUsers?.length > 0 ? (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-left">Business Name</th>
                <th className="p-3 text-left">Pickup Address</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u, i) => (
                <tr
                  key={u._id || i}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-sm text-gray-700">{u.email}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {u.sellerDetails?.businessName || "-"}
                  </td>
                  <td className="p-3 text-sm">
                    {u.sellerDetails?.pickupAddress || "-"}
                  </td>
                  <td className="p-3 text-center text-sm">
                    {u.sellerDetails?.approved
                      ? "✅ Approved"
                      : u.sellerDetails?.businessName
                      ? "⏳ Pending"
                      : "-"}
                  </td>
                  <td className="p-3 text-center">
                    {u.sellerDetails?.businessName &&
                    !u.sellerDetails?.approved ? (
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() =>
                            approveSeller(u._id).then(() =>
                              toast.success("Seller approved!")
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            rejectSeller(u._id).then(() =>
                              toast.success("Seller rejected!")
                            )
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-8 text-gray-500 text-sm">
            No users found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
