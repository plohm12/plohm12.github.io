// import { getBatchData } from './src/brewers-friend';

// export default (pluginOptions) => ({
//   beforePrepareBrowserPlugins: async (state) => {
//     const batches = await getBatchData();
//     return {
//       ...state,
//       getSiteData: async ({ dev }) => {
//         console.log('GETTING SITE DATA');
//         let siteData = {};
//         if (state.getSiteData) {
//           siteData = await state.getSiteData(dev);
//         }
//         return {
//           ...siteData,
//           batches
//         };
//       }
//     }
//   },
//   afterExport: async (state) => {
//     console.log('GOTTA STATE COMIN IN HOT');
//     const data = await state.getSiteData({dev: true});
//     console.log(JSON.stringify(data));
//     return state;
//   }
// });
