import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/baseQuery';

export const payslipApi = createApi({
  reducerPath: 'payslipApi',
  baseQuery: createBaseQuery('/api/v1/payroll'),
  tagTypes: ['Payslip', 'Payroll', 'Salary'],
  endpoints: (builder) => ({
    // Payslip endpoints
    getMyPayslips: builder.query({
      query: ({ month, year, page, pageSize }) => `/payslips/my-payslips?month=${month}&year=${year}&page=${page}&pageSize=${pageSize}`,
      providesTags: ['Payslip'],
    }),
    getPayslipById: builder.query({
      query: (id) => `/payslips/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payslip', id }],
    }),
    generatePayslip: builder.mutation({
      query: (data) => ({
        url: '/payslips/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payslip'],
    }),
    // Payroll data endpoints
    getPayrollSummary: builder.query({
      query: ({ month, year }) => `/summary?month=${month}&year=${year}`,
      providesTags: ['Payroll'],
    }),
    getPayrollByEmployee: builder.query({
      query: ({ employeeId, month, year }) => `/employee/${employeeId}?month=${month}&year=${year}`,
      providesTags: ['Payroll'],
    }),
    getAllPayrollRecords: builder.query({
      query: ({ month, year, page, pageSize }) => `/?month=${month}&year=${year}&page=${page}&pageSize=${pageSize}`,
      providesTags: ['Payroll'],
    }),
    processPayroll: builder.mutation({
      query: (data) => ({
        url: '/process',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payroll', 'Payslip'],
    }),
    approvePayroll: builder.mutation({
      query: (id) => ({
        url: `/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['Payroll'],
    }),
    markAsPaid: builder.mutation({
      query: (id) => ({
        url: `/${id}/paid`,
        method: 'PUT',
      }),
      invalidatesTags: ['Payroll'],
    }),
    // Salary structure endpoints
    getSalaryStructure: builder.query({
      query: (employeeId) => `/salary/${employeeId}`,
      providesTags: ['Salary'],
    }),
    updateSalaryStructure: builder.mutation({
      query: ({ employeeId, ...data }) => ({
        url: `/salary/${employeeId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Salary'],
    }),
    getSalaryComponents: builder.query({
      query: () => '/salary/components',
      providesTags: ['Salary'],
    }),
    // Payroll adjustments
    getPayrollAdjustments: builder.query({
      query: ({ month, year }) => `/adjustments?month=${month}&year=${year}`,
      providesTags: ['Payroll'],
    }),
    createAdjustment: builder.mutation({
      query: (data) => ({
        url: '/adjustments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payroll'],
    }),
    deleteAdjustment: builder.mutation({
      query: (id) => ({
        url: `/adjustments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGetMyPayslipsQuery,
  useGetPayslipByIdQuery,
  useGeneratePayslipMutation,
  useGetPayrollSummaryQuery,
  useGetPayrollByEmployeeQuery,
  useGetAllPayrollRecordsQuery,
  useProcessPayrollMutation,
  useApprovePayrollMutation,
  useMarkAsPaidMutation,
  useGetSalaryStructureQuery,
  useUpdateSalaryStructureMutation,
  useGetSalaryComponentsQuery,
  useGetPayrollAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useDeleteAdjustmentMutation,
} = payslipApi;
