'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import VoucherForm from './components/VoucherForm'
import VoucherDisplay from './components/VoucherDisplay'
import { Voucher } from './types/voucher'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Utility function to safely save to localStorage with error handling
const saveToLocalStorage = (vouchers: Voucher[]): boolean => {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem('ava_vouchers', JSON.stringify(vouchers))
    return true
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please delete some vouchers to free up space.')
      } else {
        console.error('localStorage error:', error)
        alert('Failed to save vouchers. Please check your browser settings.')
      }
    } else {
      console.error('Unexpected error saving to localStorage:', error)
    }
    return false
  }
}

// Optimized escapeHtml function
const escapeHtml = (text: string): string => {
  if (typeof window === 'undefined' || !text) return text || ''
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

// Generate professional voucher HTML (used by both print and PDF)
const generateVoucherHTML = (v: Voucher, formatDate: (date: string) => string): string => {
  return `
    <div class="voucher" style="position: relative;">
      <div style="position: absolute; top: 0; right: 0; width: 0.3cm; height: 100%; background-color: #f472b6; -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
      <div style="padding-right: 0.4cm; height: 100%; display: flex; flex-direction: column;">
        <div style="text-align: center; margin-bottom: 0.4cm; margin-top: 0.15cm;">
          <h1 style="font-size: 20pt; font-weight: bold; text-transform: uppercase; margin: 0; margin-bottom: 0.08cm; letter-spacing: 0.05em;">AVA${v.companySuffix ? ` ${escapeHtml(v.companySuffix)}` : ''}</h1>
          <div style="width: 3.5cm; height: 1.5px; background: #000; margin: 0 auto 0.12cm;"></div>
          <div style="display: inline-block; background: #4b5563; color: white; padding: 0.12cm 0.35cm; border-radius: 0.2cm; font-size: 9.5pt; font-weight: 600; margin-bottom: 0.08cm;">Voucher</div>
          <div style="font-size: 9pt; margin-top: 0.08cm; font-weight: 500;">${v.paymentType === 'cash' ? 'Cash' : v.paymentType === 'bank_transfer' ? 'Bank Transfer' : 'UPI'}</div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35cm; font-size: 9pt; padding: 0 0.1cm;">
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">Vr. No.</div>
            <div style="border-bottom: 1.5px solid #000; padding-bottom: 0.08cm; min-height: 0.5cm; font-size: 9pt;">${escapeHtml(v.voucherNumber)}</div>
          </div>
          <div style="flex: 1; margin-left: 0.4cm;">
            <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">Date:</div>
            <div style="border-bottom: 1.5px solid #000; padding-bottom: 0.08cm; min-height: 0.5cm; font-size: 9pt;">${escapeHtml(formatDate(v.date))}</div>
          </div>
        </div>
        <div style="margin-bottom: 0.3cm; font-size: 9pt; padding: 0 0.1cm;">
          <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">Account Head</div>
          <div style="border: 1.5px solid #000; padding: 0.25cm 0.2cm; min-height: 0.9cm; background: white; font-size: 9pt; line-height: 1.3;">${escapeHtml(v.accountHead)}</div>
        </div>
        <div style="margin-bottom: 0.3cm; font-size: 9pt; padding: 0 0.1cm;">
          <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">Pay to</div>
          <div style="border-bottom: 1.5px solid #000; padding-bottom: 0.08cm; min-height: 0.5cm; font-size: 9pt;">${escapeHtml(v.payTo)}</div>
        </div>
        <div style="margin-bottom: 0.3cm; font-size: 9pt; padding: 0 0.1cm;">
          <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">the sum of Rs.</div>
          <div style="border-bottom: 1.5px solid #000; padding-bottom: 0.08cm; min-height: 0.5cm; font-size: 9pt; line-height: 1.3;">${escapeHtml(v.sumOfRs)}</div>
        </div>
        <div style="margin-bottom: 0.3cm; font-size: 9pt; padding: 0 0.1cm;">
          <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">towards</div>
          <div style="border-bottom: 1.5px solid #000; padding-bottom: 0.08cm; min-height: 0.5cm; font-size: 9pt;">${escapeHtml(v.towards)}</div>
        </div>
        <div style="margin-bottom: 0.3cm; font-size: 9pt; width: 45%; padding: 0 0.1cm;">
          <div style="font-weight: 600; margin-bottom: 0.12cm; font-size: 8.5pt;">Rs.</div>
          <div style="border-bottom: 1.5px solid #000; padding-bottom: 0.08cm; min-height: 0.5cm; font-size: 9pt; font-weight: 500;">${v.amount.toFixed(2)}</div>
        </div>
        <div style="flex: 1; display: flex; align-items: flex-end; margin-top: auto; padding-top: 0.5cm;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0.25cm; width: 100%; padding: 0 0.1cm;">
            <div style="text-align: center;">
              <div style="border-bottom: 1.5px solid #000; height: 0.7cm; margin-bottom: 0.12cm; width: 100%;"></div>
              <div style="font-weight: 600; font-size: 7.5pt; text-align: center;">Prepared by</div>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1.5px solid #000; height: 0.7cm; margin-bottom: 0.12cm; width: 100%;"></div>
              <div style="font-weight: 600; font-size: 7.5pt; text-align: center;">Checked by</div>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1.5px solid #000; height: 0.7cm; margin-bottom: 0.12cm; width: 100%;"></div>
              <div style="font-weight: 600; font-size: 7.5pt; text-align: center;">Approved by</div>
            </div>
            <div style="text-align: center;">
              <div style="border-bottom: 1.5px solid #000; height: 0.7cm; margin-bottom: 0.12cm; width: 100%;"></div>
              <div style="font-weight: 600; font-size: 7.5pt; text-align: center;">Recd. Payment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

export default function Home() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [editingVoucher, setEditingVoucher] = useState<Voucher | undefined>()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Load vouchers from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ava_vouchers')
        if (stored) {
          const loadedVouchers = JSON.parse(stored) as Voucher[]
          // Migrate old vouchers to include companySuffix if missing, remove unused fields
          const migratedVouchers = loadedVouchers.map(v => {
            const { titleSuffix, voucherHeading, ...rest } = v as any
            return {
              ...rest,
              companySuffix: v.companySuffix || '',
              paymentType: (v.paymentType === 'cash' || v.paymentType === 'bank_transfer' || v.paymentType === 'upi') 
                ? v.paymentType 
                : 'cash'
            } as Voucher
          })
          setVouchers(migratedVouchers)
          // Update localStorage with migrated data (only if migration changed data)
          if (migratedVouchers.length !== loadedVouchers.length || 
              migratedVouchers.some((v, i) => v !== loadedVouchers[i])) {
            saveToLocalStorage(migratedVouchers)
          }
        }
      } catch (error) {
        console.error('Error loading vouchers:', error)
        // Try to recover by clearing corrupted data
        try {
          localStorage.removeItem('ava_vouchers')
          alert('Corrupted voucher data was cleared. Please create new vouchers.')
        } catch (clearError) {
          console.error('Error clearing corrupted data:', clearError)
        }
      }
    }
  }, [])

  // Debounced save to localStorage
  const debouncedSave = useCallback((vouchersToSave: Voucher[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(vouchersToSave)
    }, 300)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const saveVoucher = useCallback((voucher: Voucher) => {
    try {
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
      debouncedSave(updatedVouchers)
    } catch (error) {
      console.error('Error saving voucher:', error)
      alert('An error occurred while saving the voucher. Please try again.')
    }
  }, [vouchers, editingVoucher, debouncedSave])

  const deleteVoucher = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        const updatedVouchers = vouchers.filter(v => v.id !== id)
        setVouchers(updatedVouchers)
        debouncedSave(updatedVouchers)
        setSelectedVouchers(prev => prev.filter(vId => vId !== id))
      } catch (error) {
        console.error('Error deleting voucher:', error)
        alert('An error occurred while deleting the voucher. Please try again.')
      }
    }
  }, [vouchers, debouncedSave])

  const toggleVoucherSelection = useCallback((id: string) => {
    setSelectedVouchers(prev => 
      prev.includes(id) 
        ? prev.filter(vId => vId !== id)
        : [...prev, id]
    )
  }, [])

  const formatDate = useCallback((dateString: string): string => {
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
  }, [])

  const printSelectedVouchers = useCallback(() => {
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
      
      if (selectedVoucherData.length === 0) {
        printWindow.close()
        alert('No vouchers found to print')
        return
      }
      
      // Ensure we have pairs of 2 for A4 printing
      const pairs: Voucher[][] = []
      for (let i = 0; i < selectedVoucherData.length; i += 2) {
        pairs.push(selectedVoucherData.slice(i, i + 2))
      }

      const voucherHTML = pairs.map(pair => {
        // Always ensure 2 vouchers per pair
        const vouchersToRender = pair.length === 1 ? [pair[0], null] : pair
        
        const pairHTML = vouchersToRender.map((v) => {
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
          
          return generateVoucherHTML(v, formatDate)
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
                padding: 0.45cm;
                width: 100%;
                height: calc(50% - 0.15cm);
                display: flex;
                flex-direction: column;
                background: white;
                position: relative;
                box-sizing: border-box;
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
      
      // Wait for content to load, then print
      setTimeout(() => {
        try {
          printWindow.print()
          // Close window after printing (with delay to allow print dialog)
          setTimeout(() => {
            if (printWindow && !printWindow.closed) {
              printWindow.close()
            }
          }, 1000)
        } catch (printError) {
          console.error('Error triggering print:', printError)
          alert('An error occurred while printing. Please try again.')
          if (printWindow && !printWindow.closed) {
            printWindow.close()
          }
        }
      }, 500)
    } catch (error) {
      console.error('Print error:', error)
      alert('An error occurred while printing. Please try again.')
    }
  }, [selectedVouchers, vouchers, formatDate])

  const downloadSelectedVouchers = useCallback(async () => {
    if (selectedVouchers.length === 0) {
      alert('Please select at least one voucher to download')
      return
    }

    try {
      const selectedVoucherData = vouchers.filter(v => selectedVouchers.includes(v.id))
      
      if (selectedVoucherData.length === 0) {
        alert('No vouchers found to download')
        return
      }

      // Show loading message
      const loadingMsg = document.createElement('div')
      loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 16px;
      `
      loadingMsg.textContent = 'Generating PDF... Please wait'
      document.body.appendChild(loadingMsg)

      // Create a hidden iframe with the same HTML structure as print
      const iframe = document.createElement('iframe')
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.width = '210mm'
      iframe.style.height = '297mm'
      iframe.style.border = 'none'
      document.body.appendChild(iframe)

      // Ensure we have pairs of 2 for A4 printing
      const pairs: Voucher[][] = []
      for (let i = 0; i < selectedVoucherData.length; i += 2) {
        pairs.push(selectedVoucherData.slice(i, i + 2))
      }

      // Generate the same HTML as print function
      const voucherHTML = pairs.map(pair => {
        const vouchersToRender = pair.length === 1 ? [pair[0], null] : pair
        
        const pairHTML = vouchersToRender.map((v) => {
          if (v === null) {
            return `
              <div class="voucher" style="border: 2px dashed #ccc; background: #f9f9f9;">
                <div style="text-align: center; padding: 3cm 0; color: #999; font-size: 10pt;">
                  Empty Slot
                </div>
              </div>
            `
          }
          
          return generateVoucherHTML(v, formatDate)
        }).join('')
        
        return `<div class="voucher-pair">${pairHTML}</div>`
      }).join('')

      // Write the same HTML structure as print function
      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>PDF Vouchers - AVA Voucher</title>
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
            </style>
          </head>
          <body>
            ${voucherHTML}
          </body>
        </html>
      `

      iframe.contentDocument?.write(printHTML)
      iframe.contentDocument?.close()

      // Wait for iframe to load
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const iframeBody = iframe.contentDocument?.body
      if (!iframeBody) {
        throw new Error('Failed to load iframe content')
      }

      // Convert each pair to canvas and add to PDF
      const pairElements = iframeBody.querySelectorAll('.voucher-pair')
      for (let i = 0; i < pairElements.length; i++) {
        const pairElement = pairElements[i] as HTMLElement
        if (!pairElement) continue

        // Wait a bit for rendering
        await new Promise(resolve => setTimeout(resolve, 200))

        const canvas = await html2canvas(pairElement, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: pairElement.offsetWidth,
          height: pairElement.offsetHeight,
          allowTaint: false,
          onclone: (clonedDoc) => {
            const pinkStrips = clonedDoc.querySelectorAll('[style*="f472b6"], .voucher::after')
            pinkStrips.forEach((strip: any) => {
              if (strip) {
                strip.style.backgroundColor = '#f472b6'
                strip.style.webkitPrintColorAdjust = 'exact'
                strip.style.printColorAdjust = 'exact'
              }
            })
          }
        })

        const imgData = canvas.toDataURL('image/png', 1.0)
        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        if (i > 0) {
          pdf.addPage()
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
      }

      // Clean up
      document.body.removeChild(iframe)
      document.body.removeChild(loadingMsg)

      // Download PDF
      const fileName = `AVA_Vouchers_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Download error:', error)
      // Clean up on error
      const iframe = document.querySelector('iframe[style*="-9999px"]') as HTMLIFrameElement
      if (iframe) {
        document.body.removeChild(iframe)
      }
      const loadingMsg = document.querySelector('[style*="Generating PDF"]') as HTMLElement
      if (loadingMsg) {
        document.body.removeChild(loadingMsg)
      }
      alert('An error occurred while downloading the PDF. Please try again.')
    }
  }, [selectedVouchers, vouchers, formatDate])

  const clearAllVouchers = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all vouchers? This action cannot be undone.')) {
      try {
        setVouchers([])
        setSelectedVouchers([])
        setEditingVoucher(undefined)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ava_vouchers')
        }
      } catch (error) {
        console.error('Error clearing vouchers:', error)
        alert('An error occurred while clearing vouchers. Please try again.')
      }
    }
  }, [])

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
                <>
                  <button
                    onClick={printSelectedVouchers}
                    className="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
                  >
                    🖨️ Print Selected ({selectedVouchers.length})
                  </button>
                  <button
                    onClick={downloadSelectedVouchers}
                    className="w-full bg-green-600 text-white px-4 py-3.5 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-lg"
                  >
                    📥 Download PDF ({selectedVouchers.length})
                  </button>
                </>
              )}
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
                  <>
                    <button
                      onClick={printSelectedVouchers}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium shadow-sm"
                    >
                      🖨️ Print ({selectedVouchers.length})
                    </button>
                    <button
                      onClick={downloadSelectedVouchers}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm font-medium shadow-sm"
                    >
                      📥 Download PDF ({selectedVouchers.length})
                    </button>
                  </>
                )}
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
        {vouchers.map((voucher) => {
          const isSelected = selectedVouchers.includes(voucher.id)
          const formattedDate = new Date(voucher.createdAt).toLocaleDateString()
          
          return (
            <div key={voucher.id} className="relative">
              <div className="no-print mb-3 flex items-center gap-3 bg-white rounded-xl p-3 shadow-md">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleVoucherSelection(voucher.id)}
                  className="w-6 h-6 cursor-pointer accent-blue-600"
                  aria-label="Select voucher for printing"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{voucher.voucherNumber}</div>
                  <div className="text-xs text-gray-500">{voucher.payTo} • {formattedDate}</div>
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
          )
        })}
      </div>

      {/* Desktop: Grid layout */}
      <div className="desktop-container grid grid-cols-2 gap-6 mb-8">
        {vouchers.map((voucher) => {
          const isSelected = selectedVouchers.includes(voucher.id)
          const formattedDate = new Date(voucher.createdAt).toLocaleDateString()
          
          return (
            <div key={voucher.id} className="relative">
              <div className="no-print mb-2 flex gap-2 items-center bg-gray-50 p-2 rounded-md">
                <input
                  type="checkbox"
                  checked={isSelected}
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
                  {formattedDate}
                </span>
              </div>
              <VoucherDisplay voucher={voucher} />
            </div>
          )
        })}
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


