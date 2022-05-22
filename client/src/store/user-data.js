import { userDataService } from '@/services'
import { BehaviorSubject } from "rxjs";
import { excludedFilter } from "@/utils/filters";

const state = () => ({
  userData: new BehaviorSubject(null),
  selectedDiet: {},
  diets: [
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
  ],
});

const getters = {
  getUserData: state => state.userData.asObservable(),
  getUserDataValue: state => state.userData.value,
  getUserDiet: state => state.selectedDiet,
  getDiets: state => state.diets,
}

const actions = {
  async create({ commit }, payload) {
    return await userDataService.create(payload).then(response => {
      commit('SET_USER_DATA', response.data)
      return response
    })
  },
  async getById({ commit }, id) {
    return await userDataService.getById(id).then(response => {
      commit('SET_USER_DATA', response.data)
      return response
    })
  },
  // eslint-disable-next-line no-empty-pattern
  async edit({  }, payload) {
    return await userDataService.edit(payload).then(response => {
      return response
    })
  },
  // eslint-disable-next-line no-empty-pattern
  async delete({  }, id) {
    return await userDataService.delete(id).then(response => {
      return response
    })
  },
  setUserDiet: ({ commit }, diet) => {
    commit('SET_USER_DIET', diet)
  }
};

const mutations = {
  SET_USER_DATA: (state, userData) => {
    excludedFilter(userData, ['message'])
    state.userData.next(userData)
  },
  SET_USER_DIET: (state, diet) => {
    state.selectedDiet = diet
  }
};

export const userData = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
