export default () => {
  const theme = {
    light: {
      textColor: "black",
      backgroundColor: "white",
      containerColor: "transparent",
      activeColor: "tomato",
      dividerColor: "#cccccc"
    },
    dark: {
      textColor: "white",
      backgroundColor: "#171717",
      containerColor: "#171717",
      activeColor: "orange",
      dividerColor: "#474747",
      warningColor: "orange",
      warningBackgroundColor: "orange",
      dangerColor: '#cd3e05',
			textColorMuted: '#c0c0c0',

			textInput:{
      	default: {
					backgroundColor: '#1D1D1D',
					color: 'white'
				}
			},
      headers: {
        headerStyle: {
          backgroundColor: "#181818",
					borderBottomColor: '#2C2C2C'
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold"
        }
      },
      tabBar: {
        inactiveBackgroundColor: "#181818",
        activeBackgroundColor: "#181818",
        activeTintColor: "orange",
        inactiveTintColor: "gray",
				style: {
        	borderTopColor: '#2C2C2C'
				}
      },
      uiTable: {
        section: {
          sectionTintColor: "#171717",
          separatorTintColor: "#303030",
          headerTextColor: "#c0c0c0",
          footerTextColor: "white"
        },
        cell: {
          accessoryColor: "orange",
          backgroundColor: "#1D1D1D",
          leftDetailColor: "orange",
          rightDetailColor: "orange",
          subtitleColor: "#c0c0c0",
          titleTextColor: "white"
        }
      }
    }
  };

  return theme.dark;
};
