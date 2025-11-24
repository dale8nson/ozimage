import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Quaternion } from 'three'

interface RootState {
  posts: Post[]
  coords: {[postId: number]: Coords[]}
  currentCoords: Coords[],
  globeQuat: [number, number, number, number]
}

const initialState = { 
  posts: [],
  coords: {},
  currentCoords: [{key:"Australia", value: [-25.2744, 133.7751 ]}],
  globeQuat: [0, 0, 0, 0]
} satisfies RootState as RootState

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setPosts(state, posts) {
      state.posts = posts.payload
    },
    setCoords(state, coords) {
      state.coords = coords.payload
    },
    setCurrentCoords(state, newCoords) {
      if(newCoords.payload.length) state.currentCoords = newCoords.payload
    },
    setGlobeQuat(state, quat) {
      state.globeQuat = quat.payload
    }
  },
})

export const { setCoords, setPosts, setCurrentCoords, setGlobeQuat } = rootSlice.actions
export default rootSlice.reducer