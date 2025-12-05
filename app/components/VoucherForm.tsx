'use client'

import { useState, useEffect } from 'react'
import { Voucher } from '../types/voucher'

interface VoucherFormProps {
  onSave: (voucher: Voucher) => void
  voucher?: Voucher
}

export default function VoucherForm({ onSave, voucher }: VoucherFormProps) {
  const [formData, setFormData] = useState<Omit<Voucher, 'id' | 'createdAt'>>({
    titleSuffix: voucher?.titleSuffix || '',
    paymentType: voucher?.paymentType || 'cash',
    voucherHeading: voucher?.voucherHeading || '',
    voucherNumber: voucher?.voucherNumber || '',
    date: voucher?.date || new Date().toISOString().split('T')[0],
    accountHead: voucher?.accountHead || '',
    payTo: voucher?.payTo || '',
    sumOfRs: voucher?.sumOfRs || '',
    towards: voucher?.towards || '',
    amount: voucher?.amount || 0,
    preparedBy: voucher?.preparedBy || '',
    checkedBy: voucher?.checkedBy || '',
    approvedBy: voucher?.approvedBy || '',
    receivedBy: voucher?.receivedBy || '',
  })

  useEffect(() => {
    if (voucher) {
      setFormData({
        titleSuffix: voucher.titleSuffix,
        paymentType: voucher.paymentType,
        voucherHeading: voucher.voucherHeading,
        voucherNumber: voucher.voucherNumber,
        date: voucher.date,
        accountHead: voucher.accountHead,
        payTo: voucher.payTo,
        sumOfRs: voucher.sumOfRs,
        towards: voucher.towards,
        amount: voucher.amount,
        preparedBy: voucher.preparedBy,
        checkedBy: voucher.checkedBy,
        approvedBy: voucher.approvedBy,
        receivedBy: voucher.receivedBy,
      })
    }
  }, [voucher])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newVoucher: Voucher = {
      ...formData,
      id: voucher?.id || Date.now().toString(),
      createdAt: voucher?.createdAt || Date.now()
    }
    onSave(newVoucher)
    if (!voucher) {
      // Reset form if creating new voucher
      setFormData({
        titleSuffix: '',
        paymentType: 'cash',
        voucherHeading: '',
        voucherNumber: '',
        date: new Date().toISOString().split('T')[0],
        accountHead: '',
        payTo: '',
        sumOfRs: '',
        towards: '',
        amount: 0,
        preparedBy: '',
        checkedBy: '',
        approvedBy: '',
        receivedBy: '',
      })
    }
  }

  const formFields = (
    <>
      <div>
        <label className="voucher-label">Title Suffix (after AVA)</label>
        <input
          type="text"
          name="titleSuffix"
          value={formData.titleSuffix}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="e.g., Payment Voucher"
        />
      </div>

      <div>
        <label className="voucher-label">Payment Type</label>
        <select
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
          className="voucher-input"
          required
        >
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      <div>
        <label className="voucher-label">Voucher Heading</label>
        <input
          type="text"
          name="voucherHeading"
          value={formData.voucherHeading}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="e.g., Payment Voucher"
        />
      </div>

      <div>
        <label className="voucher-label">Voucher Number</label>
        <input
          type="text"
          name="voucherNumber"
          value={formData.voucherNumber}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="e.g., VCH-001"
        />
      </div>

      <div>
        <label className="voucher-label">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="voucher-input"
          required
        />
      </div>

      <div>
        <label className="voucher-label">Account Head</label>
        <input
          type="text"
          name="accountHead"
          value={formData.accountHead}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="Account head name"
        />
      </div>

      <div>
        <label className="voucher-label">Pay To</label>
        <input
          type="text"
          name="payTo"
          value={formData.payTo}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="Recipient name"
        />
      </div>

      <div>
        <label className="voucher-label">Sum of Rs</label>
        <input
          type="text"
          name="sumOfRs"
          value={formData.sumOfRs}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="Amount in words"
        />
      </div>

      <div>
        <label className="voucher-label">Towards</label>
        <input
          type="text"
          name="towards"
          value={formData.towards}
          onChange={handleChange}
          className="voucher-input"
          required
          placeholder="Payment purpose"
        />
      </div>

      <div>
        <label className="voucher-label">Amount (Rs)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="voucher-input"
          step="0.01"
          min="0"
          required
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="voucher-label">Prepared By</label>
        <input
          type="text"
          name="preparedBy"
          value={formData.preparedBy}
          onChange={handleChange}
          className="voucher-input"
          placeholder="Name"
        />
      </div>

      <div>
        <label className="voucher-label">Checked By</label>
        <input
          type="text"
          name="checkedBy"
          value={formData.checkedBy}
          onChange={handleChange}
          className="voucher-input"
          placeholder="Name"
        />
      </div>

      <div>
        <label className="voucher-label">Approved By</label>
        <input
          type="text"
          name="approvedBy"
          value={formData.approvedBy}
          onChange={handleChange}
          className="voucher-input"
          placeholder="Name"
        />
      </div>

      <div>
        <label className="voucher-label">Received By</label>
        <input
          type="text"
          name="receivedBy"
          value={formData.receivedBy}
          onChange={handleChange}
          className="voucher-input"
          placeholder="Name"
        />
      </div>
    </>
  )

  return (
    <form onSubmit={handleSubmit} className="no-print mb-6">
      {/* Mobile: Card style form */}
      <div className="mobile-sheet bg-white rounded-2xl shadow-xl p-5">
        <h2 className="text-xl font-bold mb-5 text-gray-800">{voucher ? 'Edit Voucher' : 'Create Voucher'}</h2>
        <div className="grid grid-cols-1 gap-4">
          {formFields}
        </div>
        <button type="submit" className="btn-primary mt-6 w-full">
          {voucher ? 'Update Voucher' : 'Create Voucher'}
        </button>
      </div>
      
      {/* Desktop: Window style form */}
      <div className="desktop-container bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{voucher ? 'Edit Voucher' : 'Create New Voucher'}</h2>
        <div className="grid grid-cols-2 gap-4">
          {formFields}
        </div>
        <button type="submit" className="btn-primary mt-6">
          {voucher ? 'Update Voucher' : 'Create Voucher'}
        </button>
      </div>
    </form>
  )
}
