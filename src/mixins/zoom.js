import * as d3 from 'd3'

export function d3zoom(parent) {
  const zoom = d3.zoom()
  .on('zoom', (e) => {
    parent.attr("transform", e.transform)
  })
  .on('end', (e) => {
    localStorage.setItem('currentZoom', e.transform)
  })

  return zoom
}



