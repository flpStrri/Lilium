import R from 'ramda'

export default casualGenerator => (
  (quantity, ...generatorProps) => {
    const isOneObjectRequest = requestQuantity => R.or(
      R.equals(requestQuantity, 1),
      R.isNil(requestQuantity),
    )

    return (
      (isOneObjectRequest(quantity)) ?
        casualGenerator(...generatorProps) :
        R.times(() => casualGenerator(...generatorProps), quantity)
    )
  }
)
