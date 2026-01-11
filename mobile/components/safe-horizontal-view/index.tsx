import { PropsWithChildren } from 'react'
import { View } from 'react-native'

const SafeHorizontalView = ({ children }: PropsWithChildren) => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      {children}
    </View>
  )
}

export default SafeHorizontalView