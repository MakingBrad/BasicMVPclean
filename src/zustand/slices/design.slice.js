import axios from 'axios';

const createDesignSlice = (set, get) =>({
    design:[],
fetchDesigns: async ()=>{
    try{
        const response = await axios.get('/api/design');
        set({ designs: response.data});
    } catch (error) {
        console.error('Error fetching designs', error);
    }
},
addDesign: async (newDesign) =>{
    try {
        await axios.post('/api/design', newDesign);
        get().fetchDesigns();
    } catch (error) {
        console.error('Error adding design:', error);
    }
},
designDetails:{
    id: 0,
    name:'',
    height_in_inches: 0,
    width_in_inches: 0,
    image_file_name: ''
}, 
setDesignDetails: function (design) {
    set({ designDetails: design});
},
setDesignName: function (newDesignName) {
    set((state) => ({
        designDetails: {...state.designDetails, name: newDesignName},
    }));
},
setDesignHeight: (newDesignHeight) => {
    set((state) => ({
        designDetails: {...state.designDetails, height_in_inches: newDesignHeight},
    }));
},
setDesignWidth: (newDesignWidth) => {
    set((state) => ({
        designDetails: {...state.designDetails, width_in_inches: newDesignWidth},
    }));
},
setDesignFileName: (newDesignFileName) => {
    set((state) => ({
        designDetails: {...state.designDetails, image_file_name: newDesignFileName},
    }));
},
})

export default createDesignSlice;