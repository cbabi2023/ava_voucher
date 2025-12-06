'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Voucher } from '../types/voucher'
import { numberToWords } from '../utils/numberToWords'

interface VoucherFormProps {
  onSave: (voucher: Voucher) => void
  voucher?: Voucher
}

function VoucherForm({ onSave, voucher }: VoucherFormProps) {
  const getInitialFormData = useCallback(() => {
    return {
      companySuffix: voucher?.companySuffix || '',
      paymentType: voucher?.paymentType || 'cash',
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
    } as Omit<Voucher, 'id' | 'createdAt'>
  }, [voucher])

  const [formData, setFormData] = useState<Omit<Voucher, 'id' | 'createdAt'>>(() => getInitialFormData())

  useEffect(() => {
    if (voucher) {
      setFormData({
        companySuffix: voucher.companySuffix,
        paymentType: voucher.paymentType,
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
    } else {
      setFormData(getInitialFormData())
    }
  }, [voucher, getInitialFormData])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const numValue = name === 'amount' ? parseFloat(value) || 0 : null
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: numValue !== null ? numValue : value
      }
      
      // Auto-fill sumOfRs when amount changes
      if (name === 'amount' && numValue !== null && numValue > 0) {
        newData.sumOfRs = numberToWords(numValue)
      }
      
      return newData
    })
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.voucherNumber.trim()) {
      alert('Please enter a voucher number')
      return
    }
    if (!formData.accountHead.trim()) {
      alert('Please enter an account head')
      return
    }
    if (!formData.payTo.trim()) {
      alert('Please enter pay to information')
      return
    }
    if (formData.amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      const newVoucher: Voucher = {
        ...formData,
        id: voucher?.id || Date.now().toString(),
        createdAt: voucher?.createdAt || Date.now()
      }
      onSave(newVoucher)
      if (!voucher) {
        // Reset form if creating new voucher
        setFormData({
          companySuffix: '',
          paymentType: 'cash',
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
    } catch (error) {
      console.error('Error saving voucher:', error)
      alert('An error occurred while saving the voucher. Please try again.')
    }
  }, [formData, voucher, onSave])

  const formFields = (
    <>
      <div>
        <label className="voucher-label">Company Name (Optional - e.g., Productions, Entertainments)</label>
        <input
          type="text"
          name="companySuffix"
          value={formData.companySuffix}
          onChange={handleChange}
          className="voucher-input"
          placeholder="Leave empty for just 'AVA'"
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
          <option value="upi">UPI</option>
        </select>
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
        <label className="voucher-label">Amount (Rs) <span className="text-xs text-gray-500">(Enter number - words will auto-fill)</span></label>
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
        <label className="voucher-label">Sum of Rs (Amount in Words) <span className="text-xs text-gray-500">(Auto-filled, editable)</span></label>
        <input
          type="text"
          name="sumOfRs"
          value={formData.sumOfRs}
          onChange={handleChange}
          className="voucher-input bg-gray-50"
          required
          placeholder="Amount in words (auto-filled from amount)"
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

export default memo(VoucherForm)
