import { createSlice } from '@reduxjs/toolkit'

interface RootState {
  posts: Post[]
  coords: {[postId: number]: Coords[]}
  currentCoords: Option<Coords[]>,
  cameraDistance: number
}

const initialState = { 
  posts: [],
  coords: {},
  // currentCoords: [{key:"Australia", value: [-25.2744, 133.7751 ]}],
  currentCoords: [{key:"", value:[0, 0]}],
  cameraDistance: 40
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
    setCameraDistance(state, distance) {
      state.cameraDistance = distance.payload
    }
  },
})

export const { setCoords, setPosts, setCurrentCoords, setCameraDistance } = rootSlice.actions
export default rootSlice.reducer