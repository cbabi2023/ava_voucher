'use client'

import { useState, useEffect } from 'react'
import VoucherForm from './components/VoucherForm'
import VoucherDisplay from './components/VoucherDisplay'
import { Voucher } from './types/voucher'

export default function Home() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [editingVoucher, setEditingVoucher] = useState<Voucher | undefined>()

  useEffect(() => {
    // Load vouchers from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ava_vouchers')
      if (stored) {
        try {
          setVouchers(JSON.parse(stored))
        } catch (error) {
          console.error('Error loading vouchers:', error)
        }
      }
    }
  }, [])

  const saveVoucher = (voucher: Voucher) => {
    let updatedVouchers: Voucher[]
    
    if (editingVoucher) {
      // Update existing voucher
      updatedVouchers = vouchers.map(v => 
        v.id === voucher.id ? voucher : v
      )
      setEditingVoucher(undefined)
    } else {
      // Add new voucher
      updatedVouchers = [...vouchers, voucher]
    }
    
    setVouchers(updatedVouchers)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ava_vouchers', JSON.stringify(updatedVouchers))
    }
  }

  const deleteVoucher = (id: string) => {
    if (confirm('Are you sure you want to delete this voucher?')) {
      const updatedVouchers = vouchers.filter(v => v.id !== id)
      setVouchers(updatedVouchers)
      if (typeof window !== 'undefined') {
        localStorage.setItem('ava_vouchers', JSON.stringify(updatedVouchers))
      }
      setSelectedVouchers(prev => prev.filter(vId => vId !== id))
    }
  }

  const toggleVoucherSelection = (id: string) => {
    setSelectedVouchers(prev => 
      prev.includes(id) 
        ? prev.filter(vId => vId !== id)
        : [...prev, id]
    )
  }

  // Escape HTML to prevent XSS
  const escapeHtml = (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const printSelectedVouchers = () => {
    if (selectedVouchers.length === 0) {
      alert('Please select at least one voucher to print')
      return
    }

    try {
      // Create a print window with selected vouchers
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow popups to print vouchers')
        return
      }

      const selectedVoucherData = vouchers.filter(v => selectedVouchers.includes(v.id))
      
      // Ensure we have pairs of 2 for A4 printing
      const pairs: Voucher[][] = []
      for (let i = 0; i < selectedVoucherData.length; i += 2) {
        pairs.push(selectedVoucherData.slice(i, i + 2))
      }

      const formatDate = (dateString: string) => {
        try {
          const date = new Date(dateString)
          if (isNaN(date.getTime())) return dateString
          return date.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          })
        } catch {
          return dateString
        }
      }

      const voucherHTML = pairs.map(pair => {
        // Always ensure 2 vouchers per pair
        const vouchersToRender = pair.length === 1 ? [pair[0], null] : pair
        
        const pairHTML = vouchersToRender.map((v, index) => {
          if (v === null) {
            // Empty placeholder for odd number of vouchers
            return `
              <div class="voucher" style="border: 2px dashed #ccc; background: #f9f9f9;">
                <div style="text-align: center; padding: 3cm 0; color: #999; font-size: 10pt;">
                  Empty Slot
                </div>
              </div>
            `
          }
          
          return `
            <div class="voucher">
              <div class="voucher-header">
                <h1>AVA</h1>
                <div class="underline"></div>
                <div class="voucher-label">Voucher</div>
                <div class="voucher-payment-type">${v.paymentType === 'cash' ? 'Cash / Bank Transfer' : 'Bank Transfer / Cash'}</div>
              </div>
              <div class="voucher-content">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3cm; margin-bottom: 0.3cm;">
                  <div>
                    <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">Vr. No.</div>
                    <div style="border-bottom: 1px solid #000; padding-bottom: 0.05cm; min-height: 0.4cm;">${escapeHtml(v.voucherNumber)}</div>
                  </div>
                  <div>
                    <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">Date:</div>
                    <div style="border-bottom: 1px solid #000; padding-bottom: 0.05cm; min-height: 0.4cm;">${escapeHtml(formatDate(v.date))}</div>
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.3cm; margin-bottom: 0.3cm;">
                  <div>
                    <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">Account Head</div>
                    <div style="border: 1px solid #000; padding: 0.2cm; min-height: 0.8cm; background: white;">${escapeHtml(v.accountHead)}</div>
                  </div>
                  <div style="border: 1px solid #000; padding: 0.2cm; min-height: 3cm; background: white;">
                    <!-- Empty box for notes -->
                  </div>
                </div>
                <div style="margin-bottom: 0.2cm;">
                  <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">Pay to</div>
                  <div style="border-bottom: 1px solid #000; padding-bottom: 0.05cm; min-height: 0.4cm;">${escapeHtml(v.payTo)}</div>
                </div>
                <div style="margin-bottom: 0.2cm;">
                  <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">the sum of Rs.</div>
                  <div style="border-bottom: 1px solid #000; padding-bottom: 0.05cm; min-height: 0.4cm;">${escapeHtml(v.sumOfRs)}</div>
                </div>
                <div style="margin-bottom: 0.2cm;">
                  <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">towards</div>
                  <div style="border-bottom: 1px solid #000; padding-bottom: 0.05cm; min-height: 0.4cm;">${escapeHtml(v.towards)}</div>
                </div>
                <div style="margin-bottom: 0.2cm;">
                  <div style="font-weight: bold; margin-bottom: 0.1cm; font-size: 9pt;">Rs.</div>
                  <div style="border-bottom: 1px solid #000; padding-bottom: 0.05cm; min-height: 0.4cm;">${v.amount.toFixed(2)}</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.2cm; margin-top: 0.3cm; padding-top: 0.2cm; border-top: 1px solid #ccc;">
                  <div>
                    <div style="font-weight: bold; font-size: 8pt; margin-bottom: 0.1cm;">Prepared by</div>
                    <div style="border-bottom: 1px solid #000; height: 0.6cm; margin-bottom: 0.05cm;"></div>
                    <div style="font-size: 7pt; color: #666;">${escapeHtml(v.preparedBy || '')}</div>
                  </div>
                  <div>
                    <div style="font-weight: bold; font-size: 8pt; margin-bottom: 0.1cm;">Checked by</div>
                    <div style="border-bottom: 1px solid #000; height: 0.6cm; margin-bottom: 0.05cm;"></div>
                    <div style="font-size: 7pt; color: #666;">${escapeHtml(v.checkedBy || '')}</div>
                  </div>
                  <div>
                    <div style="font-weight: bold; font-size: 8pt; margin-bottom: 0.1cm;">Approved by</div>
                    <div style="border-bottom: 1px solid #000; height: 0.6cm; margin-bottom: 0.05cm;"></div>
                    <div style="font-size: 7pt; color: #666;">${escapeHtml(v.approvedBy || '')}</div>
                  </div>
                  <div>
                    <div style="font-weight: bold; font-size: 8pt; margin-bottom: 0.1cm;">Recd. Payment</div>
                    <div style="border-bottom: 1px solid #000; height: 0.6cm; margin-bottom: 0.05cm;"></div>
                    <div style="font-size: 7pt; color: #666;">${escapeHtml(v.receivedBy || '')}</div>
                  </div>
                </div>
              </div>
            </div>
          `
        }).join('')
        
        return `<div class="voucher-pair">${pairHTML}</div>`
      }).join('')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Vouchers - AVA Voucher</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                margin: 0;
                padding: 0;
                background: white;
              }
              .voucher-pair {
                display: flex;
                flex-direction: column;
                gap: 0.3cm;
                page-break-after: always;
                height: 29.7cm;
                padding: 0.5cm;
              }
              .voucher-pair:last-child {
                page-break-after: auto;
              }
              .voucher {
                border: 2px solid #000;
                padding: 0.4cm;
                width: 100%;
                height: calc(50% - 0.15cm);
                display: flex;
                flex-direction: column;
                background: white;
                position: relative;
              }
              .voucher::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 0.3cm;
                height: 100%;
                background-color: #f472b6;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .voucher-header {
                text-align: center;
                margin-bottom: 0.25cm;
                padding-bottom: 0.2cm;
              }
              .voucher-header h1 {
                font-size: 18pt;
                margin: 0;
                font-weight: bold;
                line-height: 1.2;
                text-transform: uppercase;
              }
              .voucher-header .underline {
                width: 100%;
                height: 1px;
                background: #000;
                margin: 0.1cm auto;
                max-width: 3cm;
              }
              .voucher-label {
                background: #4b5563;
                color: white;
                padding: 0.1cm 0.3cm;
                border-radius: 0.15cm;
                display: inline-block;
                font-size: 9pt;
                margin-bottom: 0.1cm;
              }
              .voucher-payment-type {
                font-size: 9pt;
                margin-top: 0.1cm;
              }
              .voucher-content {
                font-size: 9pt;
                line-height: 1.4;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .voucher-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.2cm;
                padding: 0.05cm 0;
              }
              .voucher-label {
                font-weight: bold;
                min-width: 30%;
              }
              .voucher-amount {
                border-top: 2px solid #000;
                padding-top: 0.15cm;
                margin-top: 0.2cm;
                font-size: 11pt;
                font-weight: bold;
              }
              .voucher-signatures {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.25cm;
                margin-top: 0.3cm;
                padding-top: 0.2cm;
                border-top: 1px solid #000;
              }
              .signature-box {
                margin-bottom: 0.15cm;
              }
              .signature-box .label {
                font-weight: bold;
                font-size: 8pt;
                margin-bottom: 0.08cm;
              }
              .signature-line {
                border-bottom: 1px solid #000;
                height: 0.6cm;
                margin-top: 0.08cm;
              }
              .signature-name {
                font-size: 7pt;
                margin-top: 0.05cm;
                color: #333;
                min-height: 0.3cm;
              }
            </style>
          </head>
          <body>
            ${voucherHTML}
          </body>
        </html>
      `)
      
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    } catch (error) {
      console.error('Print error:', error)
      alert('An error occurred while printing. Please try again.')
    }
  }

  const downloadVouchersAsJSON = () => {
    if (vouchers.length === 0) {
      alert('No vouchers to download')
      return
    }

    try {
      const dataStr = JSON.stringify(vouchers, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ava_vouchers_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('An error occurred while downloading. Please try again.')
    }
  }

  const importVouchersFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedVouchers = JSON.parse(content) as Voucher[]
        
        if (Array.isArray(importedVouchers) && importedVouchers.length > 0) {
          if (confirm(`Import ${importedVouchers.length} voucher(s)? This will add them to your existing vouchers.`)) {
            const updatedVouchers = [...vouchers, ...importedVouchers]
            setVouchers(updatedVouchers)
            if (typeof window !== 'undefined') {
              localStorage.setItem('ava_vouchers', JSON.stringify(updatedVouchers))
            }
            alert('Vouchers imported successfully!')
          }
        } else {
          alert('Invalid file format. Please select a valid JSON file.')
        }
      } catch (error) {
        console.error('Import error:', error)
        alert('Error importing vouchers. Please check the file format.')
      }
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
  }

  const clearAllVouchers = () => {
    if (confirm('Are you sure you want to delete all vouchers? This action cannot be undone.')) {
      setVouchers([])
      setSelectedVouchers([])
      setEditingVoucher(undefined)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ava_vouchers')
      }
    }
  }

  return (
    <main className="min-h-screen">
      {/* Mobile Header */}
      <header className="mobile-sheet fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-40">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">AVA Voucher</h1>
          <p className="text-sm text-blue-100 mt-0.5">Voucher Management</p>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="desktop-container no-print mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">AVA Voucher</h1>
            <p className="text-gray-600">Professional Voucher Management System</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-8 px-4 md:px-8 max-w-7xl mx-auto pb-24 md:pb-8">
        <VoucherForm onSave={saveVoucher} voucher={editingVoucher} />

      {vouchers.length > 0 && (
        <div className="no-print mb-6">
          {/* Mobile: Compact header */}
          <div className="mobile-sheet bg-white rounded-2xl shadow-lg p-4 mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Saved Vouchers ({vouchers.length})
            </h2>
            <div className="space-y-2">
              {selectedVouchers.length > 0 && (
                <button
                  onClick={printSelectedVouchers}
                  className="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
                >
                  🖨️ Print Selected ({selectedVouchers.length})
                </button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={downloadVouchersAsJSON}
                  className="bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-lg text-sm"
                >
                  💾 Export
                </button>
                <label className="bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 active:scale-95 transition-all shadow-lg text-sm cursor-pointer text-center flex items-center justify-center">
                  📥 Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importVouchersFromJSON}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                onClick={clearAllVouchers}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 active:scale-95 transition-all shadow-lg"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>

          {/* Desktop: Toolbar style */}
          <div className="desktop-container no-print mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Saved Vouchers ({vouchers.length})
              </h2>
              <div className="flex gap-2">
                {selectedVouchers.length > 0 && (
                  <button
                    onClick={printSelectedVouchers}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium shadow-sm"
                  >
                    🖨️ Print ({selectedVouchers.length})
                  </button>
                )}
                <button
                  onClick={downloadVouchersAsJSON}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm font-medium shadow-sm"
                >
                  💾 Export JSON
                </button>
                <label className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors text-sm font-medium shadow-sm cursor-pointer">
                  📥 Import JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={importVouchersFromJSON}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={clearAllVouchers}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm font-medium shadow-sm"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Card list */}
      <div className="mobile-sheet space-y-4 mb-8">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="relative">
            <div className="no-print mb-3 flex items-center gap-3 bg-white rounded-xl p-3 shadow-md">
              <input
                type="checkbox"
                checked={selectedVouchers.includes(voucher.id)}
                onChange={() => toggleVoucherSelection(voucher.id)}
                className="w-6 h-6 cursor-pointer accent-blue-600"
                aria-label="Select voucher for printing"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{voucher.voucherHeading}</div>
                <div className="text-xs text-gray-500">{voucher.voucherNumber} • {new Date(voucher.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingVoucher(voucher)}
                  className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteVoucher(voucher.id)}
                  className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium active:scale-95 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            <VoucherDisplay voucher={voucher} />
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="desktop-container grid grid-cols-2 gap-6 mb-8">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="relative">
            <div className="no-print mb-2 flex gap-2 items-center bg-gray-50 p-2 rounded-md">
              <input
                type="checkbox"
                checked={selectedVouchers.includes(voucher.id)}
                onChange={() => toggleVoucherSelection(voucher.id)}
                className="w-4 h-4 cursor-pointer accent-blue-600"
                aria-label="Select voucher for printing"
              />
              <button
                onClick={() => setEditingVoucher(voucher)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVoucher(voucher.id)}
                className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline"
              >
                Delete
              </button>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(voucher.createdAt).toLocaleDateString()}
              </span>
            </div>
            <VoucherDisplay voucher={voucher} />
          </div>
        ))}
      </div>

      {vouchers.length === 0 && (
        <div className="text-center py-12 text-gray-500 no-print">
          {/* Mobile empty state */}
          <div className="mobile-sheet">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-medium">No vouchers yet</p>
            <p className="text-sm text-gray-400 mt-2">Create your first voucher above!</p>
          </div>
          {/* Desktop empty state */}
          <div className="desktop-container">
            <p className="text-lg">No vouchers created yet. Create your first voucher above!</p>
          </div>
        </div>
      )}

      {/* Mobile: Floating action button for new voucher */}
      {editingVoucher && (
        <button
          onClick={() => setEditingVoucher(undefined)}
          className="btn-floating mobile-sheet"
          aria-label="Cancel editing"
        >
          ✕
        </button>
      )}
      </div>
    </main>
  )
}

