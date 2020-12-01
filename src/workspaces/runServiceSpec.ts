import {WSObject} from '../api/workspace'


type Spec = {
  inputTypes: string[]
}

type InputSpec = {
  [serviceName: string]: Spec
}

export const inputSpec : InputSpec = {
  Assembly2: {
    inputTypes: ['reads']
  },
  Annotation: {
    inputTypes: ['contigs']
  },
  PhylogeneticTree: {
    inputTypes: ['genome_group']
  },
  GenomeAlignment: {
    inputTypes: ['genome_group']
  },
  ComprehensiveGenomeAnalysis: {
    inputTypes: ['reads', 'contigs']
  }
}


export function getParams(selected: WSObject[], name: string) : object {
  const count = selected.length
  const {path, type} = selected[0]

  let params = {}

  if (['Assembly2'].includes(name)) {
    if (selected.length == 1) {
      const [read] = selected.map(obj => obj.encodedPath)
      params = {single_end_libs: [{read}]}
    } else if (selected.length == 2) {
      const [read1, read2] = selected.map(obj => obj.encodedPath)
      params = {paired_end_libs: [{read1, read2}]}
    }

  } else if (name == 'Annotation' && count == 1) {
    params = {contigs: path}

  } else if (['PhylogeneticTree', 'GenomeAlignment'].includes(name) && count == 1) {
    const [path] = selected.map(obj => obj.encodedPath)
    params = {genome_groups: [path]}

  } else if (['ComprehensiveGenomeAnalysis'].includes(name)) {
    if (type == 'reads') {
      if (selected.length == 1) {
        const [read] = selected.map(obj => obj.encodedPath)
        params = {single_end_libs: [{read}], input_type: type}
      } else if (selected.length == 2) {
        const [read1, read2] = selected.map(obj => obj.encodedPath)
        params = {paired_end_libs: [{read1, read2}], input_type: type}
      }
    } else if (type == 'contigs') {
      if (selected.length == 1) {
        const [contigs] = selected.map(obj => obj.encodedPath)
        params = {contigs, input_type: type}
      }
    }
  }

  return params
}