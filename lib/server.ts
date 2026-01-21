'use server'

import * as Cesium  from 'cesium'

export async function apiToken() {
  return process.env.CESIUM_TOKEN
  // return process.env.TILESET_TOKEN
}

export async function tileset() {
  Cesium.Ion.defaultAccessToken = process.env.CESIUM_TOKEN as string
  return await Cesium.Cesium3DTileset.fromIonAssetId(1)
}

export const getCoords = async () => {

  const coords =  await fetch("http://localhost:8080/posts/coords").then(res => res.json(), res => console.log(res))
  return coords

}