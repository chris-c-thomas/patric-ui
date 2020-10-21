export default {
  unspecified: {
    label: 'Unspecified',
    formats: ['*.*']
  },
  contigs: {
    label: 'Contigs',
    formats: ['.fa', '.fasta', '.fna'],
    description: 'Contigs must be provided in fasta format (typically .fa, .fasta, .fna). Genbank formatted files are not currently accepted.'
  },
  reads: {
    label: 'Reads',
    formats: ['.fq', '.fastq', '.fa', '.fasta', '.gz', '.bz2'],
    description: 'Reads must be in fasta or fastq format (typically .fa, .fasta, .fa, .fastq).  Genbank formatted files are not currently accepted.'
  },
  diffexp_input_data: {
    label: 'Diff. Expression Input Data',
    formats: ['.csv', '.txt', '.xls', '.xlsx'],
    description: 'Differential expression input data must be in csv, txt, or excel format (.csv, .txt, .xls, .xlsx).'
  },
  diffexp_input_metadata: {
    label: 'Diff. Expression Input Metadata',
    formats: ['.csv', '.txt', '.xls', '.xlsx'],
    description: 'Differential expression input data must be in csv, txt, or excel format (.csv, .txt, .xls, .xlsx).'
  },
  feature_protein_fasta: {
    label: 'Feature Protein FASTA',
    formats: ['.fa', '.fasta', '.faa'],
    description: 'Protein sequences must be provided in fasta format (typically .fa, .fasta, .faa). Genbank formatted files are not currently accepted.'
  },
  txt: {
    label: 'Plain Text',
    formats: ['.txt'],
    description: 'A plain text file.'
  },
  pdf: {
    label: 'PDF',
    formats: ['.pdf'],
    description: 'A pdf file.'
  },
  xml: {
    label: 'XML',
    formats: ['.xml'],
    description: 'An xml file.'
  },
  json: {
    label: 'JSON',
    formats: ['.json'],
    description: 'A json file.'
  },
  csv: {
    label: 'CSV',
    formats: ['.csv'],
    description: 'A CSV (comma separated values) file.'
  },
  jpg: {
    label: 'JPEG Image',
    formats: ['.jpg', '.jpeg'],
    description: 'A JPEG image file.'
  },
  svg: {
    label: 'SVG Image',
    formats: ['.svg'],
    description: 'A SVG image file.'
  },
  gif: {
    label: 'GIF Image',
    formats: ['.gif'],
    description: 'A GIF image file.'
  },
  png: {
    label: 'PNG Image',
    formats: ['.png'],
    description: 'A PNG image file.'
  },
  nwk: {
    label: 'Newick',
    formats: ['.nwk'],
    description: 'Phylogenetic tree file.'
  }
}