// TestImageScreen.tsx
// import React from 'react';
// import { Image, StyleSheet, Text, View } from 'react-native';

// export default function TestImageScreen() {
//   return (
//     <View style={styles.container}>
//       {/* Si la imagen no carga verás el fondo rosa */}
//       <Image
//         // Ajusta la ruta según dónde esté este archivo (ver instrucciones abajo)
//         source={require('../../assets/images/ruedita_png.png')}
 //        style={styles.image}
 //        resizeMode="contain"
 //      />
// 
 //      {/* Mensaje opcional para depurar */}
 //      <Text style={styles.hint}>Para más información, haz doble click sobre cada sección de color</Text>
 //    </View>
 //  );
// }

//const styles = StyleSheet.create({
  //container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  //image: { width: '100%', height: '100%', backgroundColor: 'white' }, // fondo rosa si no carga la imagen
 // hint: { position: 'absolute', bottom: 20, color: '#666' },
//});




//import React from 'react';
//import { Dimensions, Image, StyleSheet, View } from 'react-native';
//import ImageZoom from 'react-native-image-pan-zoom';

//const { width, height } = Dimensions.get('window');

//export default function HomeScreen() {
  // Ajusta el tamaño de la imagen original para poder hacer zoom
 // const imageWidth = width * 2;  // 2 veces el ancho de pantalla
 // const imageHeight = height * 2; // 2 veces el alto de pantalla

 // return (
 //   <View style={styles.container}>
  //    <ImageZoom
  //      {...{
  //        cropWidth: width,
   //       cropHeight: height,
   //       imageWidth,
     //     imageHeight,
   //       minScale: 1,
    //      maxScale: 3,
   //       enableCenterFocus: true,
   //     } as any} // cast a any para TS
   //   >
   //     <Image
    //      source={require('../../assets/images/ruedita_png.png')}
    //      style={{ width: imageWidth, height: imageHeight }}
   //       resizeMode="contain"
   //     />
   //   </ImageZoom>
  //  </View>
 // );
//}

//const styles = StyleSheet.create({
 // container: {
  //  flex: 1,
  //  backgroundColor: 'white',
  //},
//});


import React, { useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import ImageZoom from 'react-native-image-pan-zoom';

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const size = screenWidth * 0.8;

  const categories = [
    { name: 'Inicio', color: '#0a0a0aff' },
    { name: 'Neurotoxicidad', color: '#fc75ff' },
    { name: 'Reacción vagal', color: '#ffced2' },
    { name: 'Clasificación del edema', color: '#b9ecd3' },
    { name: 'Daño tisular local', color: '#deceff' },
    { name: 'Coagulación y circulación sistémica', color: '#ff99ff' },
    { name: 'Alteraciones renales cualitativas', color: '#fffbdd' },
    { name: 'Exámenes paraclínicos complementarios', color: '#ebebeb' },
    { name: 'Clasificación y tratamiento', color: '#5ce1e6' }
  ];

  return (
    <View style={styles.container}>
      {/* Título principal */}
      <Text style={styles.titleMain}>
        Código ofídico: diagnóstico según síntomas del paciente{"\n"}y hallazgos clínicos
      </Text>

      {/* Diagrama con zoom en contenedor rectangular que ocupa todo el ancho */}
      <View style={styles.diagramBackground}>
        <ImageZoom
          cropWidth={screenWidth}
          cropHeight={screenHeight * 0.5}
          imageWidth={size}
          imageHeight={size}
          minScale={1}
          maxScale={5}
          enableCenterFocus={false}
        >
          <Image
            source={require('../../assets/images/ruedita_png.png')}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="contain"
          />
        </ImageZoom>
      </View>

      {/* Título del menú */}
      <Text style={styles.subtitle}>Información complementaria</Text>

      {/* Botones horizontales */}
      <ScrollView
        horizontal
        style={styles.menu}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map(cat => (
          <Pressable
            key={cat.name}
            style={[styles.button, { backgroundColor: cat.color }]}
            onPress={() => setSelected(cat.name)}
          >
            <Text
              style={[
                styles.buttonText,
                { color: cat.name === 'Inicio' ? 'white' : 'black' },
              ]}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal de información */}
      <Modal visible={!!selected} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <ScrollView style={{ maxHeight: '80%' }}>
              <Text style={styles.modalTitle}>{selected}</Text>
              <Text>
                Información complementaria sobre {selected}.{"\n\n"}
                {/* Aquí puedes añadir mucho más texto y se hará scroll automáticamente */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut
                risus sed sapien suscipit hendrerit. Proin tincidunt, sem non
                hendrerit sollicitudin, velit ligula commodo purus, in consequat
                nulla urna eget turpis. Donec non ligula vitae libero pharetra
                efficitur. Etiam vel purus ut lorem dignissim sodales. 
              </Text>
            </ScrollView>
            <Text style={styles.close} onPress={() => setSelected(null)}>
              Cerrar
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // fondo azul clarito
    alignItems: 'center',
    paddingTop: 40,
  },
  titleMain: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  diagramBackground: {
    backgroundColor: '#d7ebe4', // fondo blanco del diagrama
    width: '100%', // ocupa todo el ancho de la pantalla
    paddingVertical: 10,
    alignItems: 'center', // centra la imagen dentro del rectángulo
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  menu: {
    maxHeight: 80,
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 140,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#cce7ff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  close: {
    color: 'blue',
    textAlign: 'right',
    marginTop: 10,
  },
});








