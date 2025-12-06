// Convert number to words (Indian numbering system)
export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees'
  if (num < 0) return 'Negative ' + numberToWords(-num)

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ]

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ]

  function convertHundreds(n: number): string {
    if (n === 0) return ''
    let result = ''
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred'
      n %= 100
      if (n > 0) result += ' '
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)]
      n %= 10
      if (n > 0) result += ' ' + ones[n]
    } else if (n > 0) {
      result += ones[n]
    }
    
    return result.trim()
  }

  // Handle decimal part
  const integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100)

  if (integerPart === 0 && decimalPart === 0) {
    return 'Zero Rupees'
  }

  let result = ''

  // Convert integer part using Indian numbering system
  if (integerPart > 0) {
    let remaining = integerPart
    const parts: string[] = []

    // Crores (10,000,000+)
    if (remaining >= 10000000) {
      const crores = Math.floor(remaining / 10000000)
      parts.push(convertHundreds(crores) + ' Crore')
      remaining %= 10000000
    }

    // Lakhs (100,000 - 99,99,999)
    if (remaining >= 100000) {
      const lakhs = Math.floor(remaining / 100000)
      parts.push(convertHundreds(lakhs) + ' Lakh')
      remaining %= 100000
    }

    // Thousands (1,000 - 99,999)
    if (remaining >= 1000) {
      const thousands = Math.floor(remaining / 1000)
      parts.push(convertHundreds(thousands) + ' Thousand')
      remaining %= 1000
    }

    // Hundreds, Tens, Ones (1 - 999)
    if (remaining > 0) {
      parts.push(convertHundreds(remaining))
    }

    result = parts.join(' ').trim()
    result += ' Rupees'
  } else {
    result = 'Zero Rupees'
  }

  // Handle paise (decimal part)
  if (decimalPart > 0) {
    const paiseWords = convertHundreds(decimalPart)
    result += ' and ' + paiseWords + ' Paise'
  }

  // Capitalize first letter and ensure proper casing
  return result.charAt(0).toUpperCase() + result.slice(1)
}

