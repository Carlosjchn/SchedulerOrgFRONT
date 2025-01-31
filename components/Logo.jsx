import { View, Image } from "react-native";



const AppLogo = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{
          uri: "https://cdn-icons-png.freepik.com/256/9499/9499843.png?semt=ais_hybrid",
        }} // Ruta de la imagen
        style={{ width: 50, height: 50, marginLeft: 20 }} // Ajusta el tamaño de la imagen
      />
    </View>
  );

export default AppLogo;