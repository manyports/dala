import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WizardState {
  currentStep: number
  category: string
  subcategory: string
  country: string
  currency: string
  projectData: {
    title: string
    description: string
    fundingGoal: string
    deliveryDate: string
  }
  setCurrentStep: (step: number) => void
  setCategory: (category: string) => void
  setSubcategory: (subcategory: string) => void
  setCountry: (country: string) => void
  setCurrency: (currency: string) => void
  setProjectData: (data: Partial<WizardState['projectData']>) => void
  reset: () => void
}

const initialState = {
  currentStep: 1,
  category: '',
  subcategory: '',
  country: '',
  currency: '',
  projectData: {
    title: '',
    description: '',
    fundingGoal: '',
    deliveryDate: '',
  },
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      setCategory: (category) => set({ category }),
      setSubcategory: (subcategory) => set({ subcategory }),
      setCountry: (country) => set({ country }),
      setCurrency: (currency) => set({ currency }),
      setProjectData: (data) =>
        set((state) => ({
          projectData: { ...state.projectData, ...data },
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'dala-wizard-storage',
    }
  )
)
