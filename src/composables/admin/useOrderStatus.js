export function useOrderStatus() {
  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-yellow-600' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-600' },
    { value: 'shipped', label: 'Shipped', color: 'bg-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-600' }
  ]

  function getStatusLabel(status) {
    return statusOptions.find(opt => opt.value === status)?.label || status
  }

  function getStatusColor(status) {
    return statusOptions.find(opt => opt.value === status)?.color || ''
  }

  return { statusOptions, getStatusLabel, getStatusColor }
}
