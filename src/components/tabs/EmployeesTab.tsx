"use client";

import React, { useState } from "react";
import {
  Users2,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
  Plus,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Employee } from "../../data/adminData";

interface EmployeesTabProps {
  employees: Employee[];
  onUpdateAttendance: (empId: string, status: Employee["todayStatus"]) => void;
  onAddEmployee: (emp: Employee) => void;
}

export default function EmployeesTab({
  employees,
  onUpdateAttendance,
  onAddEmployee,
}: EmployeesTabProps) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New staff form state
  const [name, setName] = useState("");
  const [role, setRole] = useState<Employee["role"]>("Assistant Halwai");
  const [phone, setPhone] = useState("+91 ");
  const [shift, setShift] = useState<Employee["shift"]>("Morning (6 AM - 2 PM)");
  const [monthlySalary, setMonthlySalary] = useState(24000);
  const [taskInput, setTaskInput] = useState("");

  const filteredStaff = employees.filter((e) => {
    if (roleFilter !== "all" && e.role !== roleFilter) return false;
    return true;
  });

  const presentCount = employees.filter((e) => e.todayStatus === "Present").length;
  const totalPayroll = employees.reduce((sum, e) => sum + e.monthlySalary, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      role,
      phone,
      shift,
      monthlySalary,
      todayStatus: "Present",
      attendanceRecord: [{ date: new Date().toISOString().split("T")[0], status: "P" }],
      performanceScore: 90,
      tasksAssigned: taskInput ? [taskInput] : ["General kitchen assistance"],
    };
    onAddEmployee(newEmp);
    setShowAddModal(false);
    setName("");
    setPhone("+91 ");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Staff, Halwai Attendance & Payroll Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {presentCount} / {employees.length} On Duty Today
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track daily attendance, morning/evening shifts, kitchen task allocation & monthly salary registers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff / Halwai</span>
        </button>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Today's Attendance</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {presentCount} Present
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {employees.length - presentCount} on leave or absent
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Monthly Payroll Budget</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalPayroll.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across Halwais, cashiers, kitchen & delivery staff
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Kitchen Master In-Charge</div>
          <div className="text-base font-extrabold text-slate-900 mt-1">
            Ramesh Sharma & Dinanath Maharaj
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">
            Head Halwai & Bengali Sweets Craftsman
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs w-fit">
        {["all", "Head Halwai", "Snack Cook", "Cashier", "Packaging Staff", "Delivery Rider"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === r ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {r === "all" ? "All Team Members" : r}
          </button>
        ))}
      </div>

      {/* Staff Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((emp) => {
          const isPresent = emp.todayStatus === "Present";
          return (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 font-extrabold text-slate-800 flex items-center justify-center text-sm">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{emp.name}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-bold text-slate-700">{emp.role}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {emp.performanceScore}% Score
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs mb-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Phone:</span>
                    <span className="font-semibold text-slate-900">{emp.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Assigned Shift:</span>
                    <span className="font-bold text-slate-800">{emp.shift}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly Salary:</span>
                    <span className="font-bold text-slate-900">₹{emp.monthlySalary.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Tasks */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Assigned Kitchen Responsibilities
                    </div>
                    <ul className="space-y-1">
                      {emp.tasksAssigned.map((task, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-red-500"></span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Attendance Quick Toggle */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-500">Today's Attendance</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      emp.todayStatus === "Present"
                        ? "bg-emerald-100 text-emerald-800"
                        : emp.todayStatus === "Half Day"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {emp.todayStatus}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
                  {(["Present", "Half Day", "Absent", "On Leave"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateAttendance(emp.id, st)}
                      className={`py-1 rounded text-center transition-colors ${
                        emp.todayStatus === st
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st === "Present" ? "P" : st === "Half Day" ? "HD" : st === "Absent" ? "A" : "L"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shyam Bihari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Head Halwai">Head Halwai</option>
                    <option value="Assistant Halwai">Assistant Halwai</option>
                    <option value="Snack Cook">Snack Cook</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Packaging Staff">Packaging Staff</option>
                    <option value="Delivery Rider">Delivery Rider</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</option>
                    <option value="Evening (2 PM - 10 PM)">Evening (2 PM - 10 PM)</option>
                    <option value="Full Day (8 AM - 8 PM)">Full Day (8 AM - 8 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Kitchen Duty</label>
                <input
                  type="text"
                  placeholder="e.g. Samosa fryer assistant, evening tea counter"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
