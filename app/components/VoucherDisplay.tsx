'use client'

import { Voucher } from '../types/voucher'

interface VoucherDisplayProps {
  voucher: Voucher
}

export default function VoucherDisplay({ voucher }: VoucherDisplayProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  return (
    <div className="voucher-container print-voucher relative bg-white">
      {/* Pink vertical strip on the right */}
      <div className="absolute top-0 right-0 w-2 md:w-3 h-full bg-pink-400 print-strip"></div>
      
      <div className="pr-2 md:pr-3">
        {/* Header Section */}
        <div className="text-center mb-6 mt-4">
          {/* AVA with underline */}
          <div className="mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-wide">AVA</h1>
            <div className="w-full h-0.5 bg-black mt-1 mx-auto" style={{ maxWidth: '200px' }}></div>
          </div>
          
          {/* Voucher label - dark grey rounded rectangle with white text */}
          <div className="inline-block mb-2">
            <span className="bg-gray-700 text-white px-4 py-1 rounded-md text-sm md:text-base font-medium">
              Voucher
            </span>
          </div>
          
          {/* Payment Type */}
          <div className="text-black text-sm md:text-base mt-2">
            {voucher.paymentType === 'cash' ? 'Cash' : 'Bank Transfer'}
            {voucher.paymentType === 'cash' ? ' / Bank Transfer' : ' / Cash'}
          </div>
        </div>

        {/* Main Body - Two Column Layout */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm md:text-base">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Vr. No. */}
            <div>
              <div className="font-semibold text-black mb-1">Vr. No.</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{voucher.voucherNumber}</div>
            </div>

            {/* Account Head */}
            <div>
              <div className="font-semibold text-black mb-1">Account Head</div>
              <div className="border border-black p-2 min-h-[40px] bg-white">{voucher.accountHead}</div>
            </div>

            {/* Pay to */}
            <div>
              <div className="font-semibold text-black mb-1">Pay to</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{voucher.payTo}</div>
            </div>

            {/* the sum of Rs. */}
            <div>
              <div className="font-semibold text-black mb-1">the sum of Rs.</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{voucher.sumOfRs}</div>
            </div>

            {/* towards */}
            <div>
              <div className="font-semibold text-black mb-1">towards</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{voucher.towards}</div>
            </div>

            {/* Rs. */}
            <div>
              <div className="font-semibold text-black mb-1">Rs.</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{voucher.amount.toFixed(2)}</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Date */}
            <div>
              <div className="font-semibold text-black mb-1">Date:</div>
              <div className="border-b border-black pb-1 min-h-[20px]">{formatDate(voucher.date)}</div>
            </div>

            {/* Large empty box */}
            <div className="border border-black p-3 min-h-[200px] bg-white">
              {/* Empty space for additional notes or description */}
            </div>
          </div>
        </div>

        {/* Footer Section - Signatures */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4 border-t border-gray-300">
          <div>
            <div className="font-semibold text-black mb-2 text-xs md:text-sm">Prepared by</div>
            <div className="border-b border-black pb-1 min-h-[30px]"></div>
            <div className="text-xs mt-1 text-gray-600">{voucher.preparedBy || ''}</div>
          </div>
          <div>
            <div className="font-semibold text-black mb-2 text-xs md:text-sm">Checked by</div>
            <div className="border-b border-black pb-1 min-h-[30px]"></div>
            <div className="text-xs mt-1 text-gray-600">{voucher.checkedBy || ''}</div>
          </div>
          <div>
            <div className="font-semibold text-black mb-2 text-xs md:text-sm">Approved by</div>
            <div className="border-b border-black pb-1 min-h-[30px]"></div>
            <div className="text-xs mt-1 text-gray-600">{voucher.approvedBy || ''}</div>
          </div>
          <div>
            <div className="font-semibold text-black mb-2 text-xs md:text-sm">Recd. Payment</div>
            <div className="border-b border-black pb-1 min-h-[30px]"></div>
            <div className="text-xs mt-1 text-gray-600">{voucher.receivedBy || ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

