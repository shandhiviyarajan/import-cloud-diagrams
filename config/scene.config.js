var SCENE_CONFIG = {
  FONT: {
    SIZE: 11,
    COLOR: 0xffffff,
  },
  SCENE: {
    GRID: false,
    GRID_CENTER_LINE_COLOR: 0xffffff,
    GRID_LINE_COLOR: 0x888888,
    GRID_UNIT_SIZE: 100,
    BACKGROUND_COLOR: 0xffffff,
    PLANE_COLOR: 0x787878,
    LINK_COLOR: 0xffffff,
  },
  ENVIRONMENT: {
    SUBNET_COLOR: 0x696969,
    AZ_COLOR: 0x606060,
    VPC_COLOR: 0x303030,
    CUBE_COLOR: 0x808080,
  },
  LIGHTING: {
    DIRECTIONAL: {
      INTENSITY: 1.25,
      SHADOWS: false,
      COLOR: 0xffffff,
      POSITION: {
        x: 0,
        y: -1000,
        z: 1000,
      },
      VISIBLE: true,
    },
    AMBIENT: {
      VISIBLE: true,
      INTENSITY: 1,
      COLOR: 0x404040,
    },
  },
  HIGHLIGHTING: {
    edgeStrength: 10,
    edgeGlow: 0,
    edgeThickness: 5,
    visibleEdgeColor: 0x008000,
  },
  CONTROLS: {
    minDistance: 250,
    maxDistance: 5000,
    dampingFactor: 0.25,
    keyPanSpeed: 250,
    enableDamping: true,

    // Doing this to allow rotating the scene using mouse
    maxAzimuthAngle: 0,
    minAzimuthAngle: 0,

    // Lock this to allow top/down angle
    maxPolarAngle: Math.PI / 3,
    minPolarAngle: Math.PI / 3,
  },
};

export { SCENE_CONFIG };
