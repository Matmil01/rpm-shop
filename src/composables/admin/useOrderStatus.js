// Composable for order status options and helpers
export function useOrderStatus() {
  // List of possible order statuses with labels and colors
  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-yellow-600' },
    { value: 'processing', label: 'Processing', color: 'bg-blue-600' },
    { value: 'shipped', label: 'Shipped', color: 'bg-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-600' }
  ]

  // Returns the label for a given status value
  function getStatusLabel(status) {
    return statusOptions.find(opt => opt.value === status)?.label || status
  }

  // Returns the color class for a given status value
  function getStatusColor(status) {
    return statusOptions.find(opt => opt.value === status)?.color || ''
  }

  // Expose options and helper functions
  return { statusOptions, getStatusLabel, getStatusColor }
}
