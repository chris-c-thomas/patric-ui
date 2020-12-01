import {WSObject} from '../api/workspace'



type InputSpec = {
  [serviceName: string]: {
    inputTypes: string[]
  }
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
  const {encodedPath, type} = selected[0]

  let params = {}

  if (['Assembly2'].includes(name)) {
    if (selected.length == 1) {
      params = {single_end_libs: [{read: encodedPath}]}
    } else if (selected.length == 2) {
      const [read1, read2] = selected.map(obj => obj.encodedPath)
      params = {paired_end_libs: [{read1, read2}]}
    }

  } else if (['Annotation'].includes(name) && count == 1) {
    params = {contigs: encodedPath}

  } else if (['PhylogeneticTree', 'GenomeAlignment'].includes(name) && count == 1) {
    params = {genome_groups: [encodedPath]}

  } else if (['ComprehensiveGenomeAnalysis'].includes(name)) {
    if (type == 'reads') {
      if (selected.length == 1) {
        params = {single_end_libs: [{read: encodedPath}], input_type: type}
      } else if (selected.length == 2) {
        const [read1, read2] = selected.map(obj => obj.encodedPath)
        params = {paired_end_libs: [{read1, read2}], input_type: type}
      }
    } else if (type == 'contigs' && selected.length == 1) {
      const contigs = selected[0].encodedPath
      params = {contigs, input_type: type}
    }
  }

  return params
}