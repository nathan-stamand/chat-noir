function createTimeStamp() {
  const settings = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return Intl.DateTimeFormat('en', settings).format(new Date());
}

module.exports = { createTimeStamp };
