'use client'

import { useMemo, memo } from 'react'
import { Voucher } from '../types/voucher'

interface VoucherDisplayProps {
  voucher: Voucher
}

function VoucherDisplay({ voucher }: VoucherDisplayProps) {
  const formatDate = useMemo(() => {
    return (dateString: string): string => {
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateString)
          return dateString
        }
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        })
      } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
      }
    }
  }, [])

  const formattedDate = useMemo(() => formatDate(voucher.date), [voucher.date, formatDate])
  
  const paymentTypeLabel = useMemo(() => {
    switch (voucher.paymentType) {
      case 'cash':
        return 'Cash'
      case 'bank_transfer':
        return 'Bank Transfer'
      case 'upi':
        return 'UPI'
      default:
        return 'Cash'
    }
  }, [voucher.paymentType])

  const companyName = useMemo(() => {
    return voucher.companySuffix ? ` ${voucher.companySuffix}` : ''
  }, [voucher.companySuffix])

  return (
    <div className="voucher-container print-voucher relative bg-white" style={{ border: 'none', boxShadow: 'none' }}>
      {/* Pink vertical strip on the right edge */}
      <div 
        className="absolute top-0 right-0 h-full print-strip" 
        style={{ 
          width: '8px',
          backgroundColor: '#f472b6'
        }}
      ></div>
      
      <div className="pr-3" style={{ paddingRight: '12px' }}>
        {/* Header Section */}
        <div className="mb-6 mt-4">
          {/* AVA with underline - centered */}
          <div className="text-center mb-3">
            <h1 className="text-4xl font-bold text-black uppercase tracking-wide mb-1">
              AVA{companyName}
            </h1>
            <div className="w-48 h-0.5 bg-black mx-auto"></div>
          </div>
          
          {/* Voucher label and Payment Type - centered */}
          <div className="text-center mb-4">
            <div className="inline-block mb-2">
              <span className="bg-gray-700 text-white px-4 py-1.5 rounded-md text-sm font-medium">
                Voucher
              </span>
            </div>
            <div className="text-black text-sm mt-2">
              {paymentTypeLabel}
            </div>
          </div>

          {/* Vr. No. and Date - same line, left and right */}
          <div className="flex justify-between mb-4 text-sm">
            <div className="flex-1">
              <div className="font-semibold text-black mb-1">Vr. No.</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{voucher.voucherNumber}</div>
            </div>
            <div className="flex-1 ml-4">
              <div className="font-semibold text-black mb-1">Date:</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{formattedDate}</div>
            </div>
          </div>
        </div>

        {/* Main Body - Simplified Layout */}
        <div className="space-y-4 mb-6 text-sm">
          {/* Account Head - Full width box */}
          <div>
            <div className="font-semibold text-black mb-1">Account Head</div>
            <div className="border border-black p-2 min-h-[50px] bg-white w-full">{voucher.accountHead}</div>
          </div>

          {/* Pay to - Full width line */}
          <div>
            <div className="font-semibold text-black mb-1">Pay to</div>
            <div className="border-b border-black pb-1 min-h-[20px] w-full">{voucher.payTo}</div>
          </div>

          {/* the sum of Rs. - Full width line */}
          <div>
            <div className="font-semibold text-black mb-1">the sum of Rs.</div>
            <div className="border-b border-black pb-1 min-h-[20px] w-full">{voucher.sumOfRs}</div>
          </div>

          {/* towards - Full width line */}
          <div>
            <div className="font-semibold text-black mb-1">towards</div>
            <div className="border-b border-black pb-1 min-h-[20px] w-full">{voucher.towards}</div>
          </div>

          {/* Rs. - Shorter line */}
          <div className="w-1/2">
            <div className="font-semibold text-black mb-1">Rs.</div>
            <div className="border-b border-black pb-1 min-h-[20px]">{voucher.amount.toFixed(2)}</div>
          </div>
        </div>

        {/* Footer Section - Four Signatures in a row */}
        <div className="grid grid-cols-4 gap-4 mt-16 pt-8">
          <div>
            <div className="border-b border-black pb-1 min-h-[40px] mb-2"></div>
            <div className="font-semibold text-black text-xs">Prepared by</div>
          </div>
          <div>
            <div className="border-b border-black pb-1 min-h-[40px] mb-2"></div>
            <div className="font-semibold text-black text-xs">Checked by</div>
          </div>
          <div>
            <div className="border-b border-black pb-1 min-h-[40px] mb-2"></div>
            <div className="font-semibold text-black text-xs">Approved by</div>
          </div>
          <div>
            <div className="border-b border-black pb-1 min-h-[40px] mb-2"></div>
            <div className="font-semibold text-black text-xs">Recd. Payment</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(VoucherDisplay)

