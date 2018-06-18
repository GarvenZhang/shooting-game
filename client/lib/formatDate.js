/**
 * @日期格式化
 *
 * @param {String} pattern 日期格式 (格式化字符串的符号参考w3标准 http://www.w3.org/TR/NOTE-datetime)
 * @param {Date Object} date 待格式化的日期对象
 * @return {String} 格式化后的日期字符串
 * @example
 * formatDate("YYYY-MM-DD hh:mm:ss", (new Date()));
 */
module.exports = function (pattern, date) {
  if (typeof date === 'number') date = new Date(date)
  function formatNumber (data, format) { //
    format = format.length
    data = data || 0
    return format == 1 ? data : String(Math.pow(10, format) + data).slice(-format)
  }

  var result = pattern.replace(/([YMDhsm])\1*/g, function (format) {
    switch (format.charAt()) {
      case 'Y':
        return formatNumber(date.getFullYear(), format)
      case 'M':
        return formatNumber(date.getMonth() + 1, format)
      case 'D':
        return formatNumber(date.getDate(), format)
      case 'w':
        return date.getDay() + 1
      case 'h':
        return formatNumber(date.getHours(), format)
      case 'm':
        return formatNumber(date.getMinutes(), format)
      case 's':
        return formatNumber(date.getSeconds(), format)
    }
  })
  return result
}
