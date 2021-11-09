const initialData = {
  /*
  tasks: {
    'task-1': { id: 'task-1', isRemoved: false, isHoveredOver: false, content: 'Take out the garbage' },
    'task-2': { id: 'task-2', isRemoved: false, isHoveredOver: true, content: 'Watch my favourite show' },
    'task-3': { id: 'task-3', isRemoved: false, isHoveredOver: false, content: 'Charge my phone' },
    'task-4': { id: 'task-4', isRemoved: false, isHoveredOver: false, content: 'Cook dinner' },
    'removemarker': { id: 'removemarker', isRemoved: true, isHoveredOver: false, content: 'Remove Marker' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'removemarker'],
    }
  },
  ColumnOrder: ['column-1'],
  */

  tasks: {
    'task-1': { id: 'task-1', isRemoved: false, isHoveredOver: true, content: 'melting means matter / a substance changes from a solid into a liquid by increasing heat energy', relevance: 4, score: 0.38 },
    'task-2': { id: 'task-2', isRemoved: false, isHoveredOver: false, content: 'melting is a kind of phase change', relevance: 3, score: 0.16 },
    'task-3': { id: 'task-3', isRemoved: false, isHoveredOver: false, content: 'heat energy can change the state of matter', relevance: 3, score: 0.15 },
    'task-4': { id: 'task-4', isRemoved: false, isHoveredOver: false, content: 'melting is when solids are heated above their melting point', relevance: 3, score: 0.13 },
    'task-5': { id: 'task-5', isRemoved: false, isHoveredOver: false, content: 'an ice cube is a kind of solid', relevance: 3, score: 0.12 },
    'task-6': { id: 'task-6', isRemoved: false, isHoveredOver: false, content: 'ice is a kind of solid', relevance: 3, score: 0.11 },
    'task-7': { id: 'task-7', isRemoved: false, isHoveredOver: false, content: 'ice cube is made of ice', relevance: 3, score: 0.10 },
    'task-8': { id: 'task-8', isRemoved: false, isHoveredOver: false, content: 'heating means adding heat', relevance: 3, score: 0.07 },
    'task-9': { id: 'task-9', isRemoved: false, isHoveredOver: false, content: 'temperature is a measure of heat energy', relevance: 3, score: 0.06 },
    'task-10': { id: 'task-10', isRemoved: false, isHoveredOver: false, content: 'heat means temperature increases', relevance: 3, score: 0.05 },
    'task-11': { id: 'task-11', isRemoved: false, isHoveredOver: false, content: 'water is a kind of liquid at room temperature', relevance: 2, score: -0.02 },
    'task-12': { id: 'task-12', isRemoved: false, isHoveredOver: false, content: 'melting is a kind of process', relevance: 2, score: -0.19 },
    'task-13': { id: 'task-13', isRemoved: false, isHoveredOver: false, content: 'water is a kind of substance', relevance: 2, score: -0.25 },
    'task-14': { id: 'task-14', isRemoved: false, isHoveredOver: false, content: 'a hot substance is a source of heat', relevance: 2, score: -0.27 },
    'task-15': { id: 'task-15', isRemoved: false, isHoveredOver: false, content: 'if an object / a substance / a location absorbs solar energy then that object / that substance will increase in temperature', relevance: 3, score: -0.28 },
    'task-16': { id: 'task-16', isRemoved: false, isHoveredOver: false, content: 'a liquid is a kind of substance', relevance: 2, score: -0.28 },
    'task-17': { id: 'task-17', isRemoved: false, isHoveredOver: false, content: 'a container is a kind of object', relevance: 1, score: -0.29 },
    'task-18': { id: 'task-18', isRemoved: false, isHoveredOver: false, content: 'an ice cube is a kind of object', relevance: 2, score: -0.30 },
    'task-19': { id: 'task-19', isRemoved: false, isHoveredOver: false, content: 'substances are made of matter', relevance: 2, score: -0.29 },
    'task-20': { id: 'task-20', isRemoved: false, isHoveredOver: false, content: 'a solid is a kind of substance', relevance: 2, score: -0.30 },
    'task-21': { id: 'task-21', isRemoved: false, isHoveredOver: false, content: 'a hot / warm something is a source of heat', relevance: 2, score: -0.30 },
    'task-22': { id: 'task-22', isRemoved: false, isHoveredOver: false, content: 'if a thermal conductor / an object is exposed to a source of heat then that conductor / that object may become hot / warm', relevance: 3, score: -0.30 },
    'task-23': { id: 'task-23', isRemoved: false, isHoveredOver: false, content: 'the sun is the source of solar energy called sunlight', relevance: 2, score: -0.30 },
    'task-24': { id: 'task-24', isRemoved: false, isHoveredOver: false, content: 'the sun is a source of light / light energy called sunlight', relevance: 3, score: -0.31 },
    'task-25': { id: 'task-25', isRemoved: false, isHoveredOver: false, content: 'a container contains objects / material / substances', relevance: 1, score: -0.31 },
    'task-26': { id: 'task-26', isRemoved: false, isHoveredOver: false, content: 'the sun transfers solar energy / light energy / heat energy from itself to the planets / Earth through sunlight', relevance: 3, score: -0.33 },
    'task-27': { id: 'task-27', isRemoved: false, isHoveredOver: false, content: 'water is in the liquid state , called liquid water , for temperatures between 273 / 32 / 0 and 373 / 212 / 100 K / F / C', relevance: 2, score: -0.33 },
    'task-28': { id: 'task-28', isRemoved: false, isHoveredOver: false, content: 'if an object / something is in the sunlight then that object / that something will absorb solar energy', relevance: 3, score: -0.33 },
    'task-29': { id: 'task-29', isRemoved: false, isHoveredOver: false, content: 'water is in the solid state , called ice , for temperatures between 0 / -459 / -273 and 273 / 32 / 0 K / F / C', relevance: 2, score: -0.33 },
    'task-30': { id: 'task-30', isRemoved: false, isHoveredOver: false, content: 'a cube is a kind of object', relevance: 1, score: -0.36 },
    'task-31': { id: 'task-31', isRemoved: false, isHoveredOver: false, content: 'the freshwater is 3 in percentagle of total water on Earth', relevance: 1, score: -1.01 },
    'removemarker': { id: 'removemarker', isRemoved: true, isHoveredOver: false, content: 'Remove Marker' },
    'aboutmarker': { id: 'aboutmarker', isRemoved: true, isHoveredOver: false, content: 'This question is about [QuestionClass]. ' },
    'coremarker': { id: 'coremarker', isRemoved: true, isHoveredOver: false, content: 'The core concepts to know to answer this question are: ' },
    'othermarker': { id: 'othermarker', isRemoved: true, isHoveredOver: false, content: 'Other facts that help answer this question are: ' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Facts',
      taskIds: ['aboutmarker', 'coremarker', 'othermarker', 'task-1', 'task-2', 'task-3', 'task-4', 'removemarker', 'task-5', 'task-6', 'task-7', 'task-8', 'task-9', 'task-10', 'task-11', 'task-12', 'task-13', 'task-14', 'task-15', 'task-16', 'task-17', 'task-18', 
                'task-19', 'task-20', 'task-21', 'task-22', 'task-23', 'task-24', 'task-25', 'task-26', 'task-27', 'task-28', 'task-29', 'task-30', 'task-31'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Discourse',
      taskIds: [''],
    },
    'column-3': {
      id: 'column-3',
      title: 'Modifier',
      taskIds: [],
    },
  },
  ColumnOrder: ['column-3', 'column-1', 'column-2'],


};

export default initialData;

