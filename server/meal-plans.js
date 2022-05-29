db.meal_plans.insertMany([
  {
    title: 'Keto',
    proportions: {
      CARBS: 5,
      PROTEIN: 25,
      FAT: 70
    }
  },
  {
    title: 'Low Carb High Fat',
    proportions: {
      CARBS: 12,
      PROTEIN: 25,
      FAT: 63
    }
  },
  {
    title: 'High-Protein Keto',
    proportions: {
      CARBS: 5,
      PROTEIN: 35,
      FAT: 60
    }
  },
  {
    title: 'No Carb / Carnivore',
    proportions: {
      CARBS: 0,
      PROTEIN: 25,
      FAT: 75
    }
  },
  {
    title: 'Low Carb Moderate Fat',
    proportions: {
      CARBS: 20,
      PROTEIN: 40,
      FAT: 40
    }
  },
  {
    title: 'Moderate Carb & Fat',
    proportions: {
      CARBS: 30,
      PROTEIN: 30,
      FAT: 40
    }
  },
  {
    title: 'Even Split',
    proportions: {
      CARBS: 33,
      PROTEIN: 33,
      FAT: 33
    }
  },
  {
    title: 'Zone',
    proportions: {
      CARBS: 40,
      PROTEIN: 30,
      FAT: 30
    }
  },
  {
    title: 'High Protein',
    proportions: {
      CARBS: 25,
      PROTEIN: 40,
      FAT: 35
    }
  },
  {
    title: 'High Carb Low Fat',
    proportions: {
      CARBS: 50,
      PROTEIN: 15,
      FAT: 35
    }
  },
  {
    title: 'Custom',
    proportions: {
      CARBS: 33,
      PROTEIN: 33,
      FAT: 33
    }
  },
])