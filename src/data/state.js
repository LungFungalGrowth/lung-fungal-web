import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';

import http from '@/http';

class State {
  constructor(geometry, spore, macrophage) {
    this.geometry = State.loadImageData(geometry);
    this.spore = State.loadPolyData(spore);
    this.macrophage = State.loadPolyData(macrophage);
  }

  static async load(id) {
    const [geometry, spore, macrophage] = await Promise.all([
      State.loadFile(id, 'geometry_001.vti'),
      State.loadFile(id, 'spore_001.vtp'),
      State.loadFile(id, 'macrophage_001.vtp'),
    ]);
    return new State(geometry, spore, macrophage);
  }

  static async loadFile(folderId, name) {
    let item;
    let file;
    try {
      [item] = (await http.get('item', {
        params: {
          folderId,
          name,
          limit: 1,
        },
      })).data;
    } catch (e) {
      console.error(`Error loading items from ${folderId}`); // eslint-disable-line no-console
      throw e;
    }
    try {
      [file] = (await http.get(`item/${item._id}/files`, {
        params: {
          limit: 1,
        },
      })).data;
    } catch (e) {
      console.error(`Error loading files from ${item._id}`); // eslint-disable-line no-console
      throw e;
    }
    try {
      return (await http.get(`file/${file._id}/download`, {
        responseType: 'arraybuffer',
      })).data;
    } catch (e) {
      console.error(`Error loading data from ${file._id}`); // eslint-disable-line no-console
      throw e;
    }
  }

  static loadImageData(buffer) {
    const imageDataReader = vtkXMLImageDataReader.newInstance();
    const success = imageDataReader.parseAsArrayBuffer(buffer);
    if (!success) {
      throw new Error('Could not load image data');
    }
    return imageDataReader.getOutputData(0);
  }

  static loadPolyData(buffer) {
    const polyDataReader = vtkXMLPolyDataReader.newInstance();
    const success = polyDataReader.parseAsArrayBuffer(buffer);
    if (!success) {
      throw new Error('Could not load poyy data');
    }
    return polyDataReader.getOutputData(0);
  }
}

export default State;