import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// @ts-ignore
import { Maximize2 } from "lucide-react-native";
import ImageZoom from "react-native-image-pan-zoom";

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  const zoomRef = useRef<any>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [rotation, setRotation] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const size = screenWidth * 0.8;

  const categories = [
    { name: "Inicio", color: "#0a0a0aff" },
    { name: "Neurotoxicidad", color: "#fc75ff" },
    { name: "Reacción vagal", color: "#ffced2" },
    { name: "Clasificación del edema", color: "#b9ecd3" },
    { name: "Daño tisular local", color: "#deceff" },
    { name: "Coagulación y circulación sistémica", color: "#b2fffa" },
    { name: "Alteraciones renales cualitativas", color: "#fffbdd" },
    { name: "Exámenes paraclínicos complementarios", color: "#ebebeb" },
    { name: "Clasificación y tratamiento", color: "#5ce1e6" },
  ];

  const handleResetZoom = () => setResetTrigger((prev) => prev + 1);
  const handleResetRotation = () => setRotation(0);

  return (
    <View style={styles.container}>
      {/* 🔹 Controles superiores */}
      <View style={styles.topControls}>
        <View style={styles.rotationControls}>
          <TouchableOpacity onPress={() => setRotation((r) => r - 30)}>
            <Text style={styles.rotationText}>↺ 30°</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResetRotation}>
            <Text style={styles.rotationTextCenter}>0°</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setRotation((r) => r + 30)}>
            <Text style={styles.rotationText}>↻ 30°</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetZoom}>
          <Maximize2 size={20} color="#007aff" />
        </TouchableOpacity>
      </View>

      {/* Diagrama */}
      <View style={styles.diagramBackground}>
        <View
          style={{
            width: size * 1.6,
            height: size * 1.6,
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <ImageZoom
            key={resetTrigger}
            ref={zoomRef}
            cropWidth={screenWidth}
            cropHeight={screenHeight * 0.62}
            imageWidth={size}
            imageHeight={size}
            minScale={1}
            maxScale={5}
            enableCenterFocus={false}
            style={{ overflow: "visible" }}
          >
            <Animated.Image
              source={require("../../assets/images/ruedita_png.png")}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: "#d7ebe4",
                transform: [{ rotate: `${rotation}deg` }],
              }}
              resizeMode="contain"
            />
          </ImageZoom>
        </View>
      </View>

      {/* Menú scrollable con recuadro blanco */}
      <View
        style={styles.menuContainer}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {/* Difuminado superior */}
        <LinearGradient
          colors={["white", "rgba(255,255,255,0)"]}
          style={[styles.gradientOverlay, { top: 0 }]}
          pointerEvents="none"
        />

        <Animated.ScrollView
          style={styles.menu}
          contentContainerStyle={{
            paddingVertical: 10,
            alignItems: "center",
            paddingRight: 4,
          }}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          indicatorStyle="black"
          scrollEventThrottle={16}
          onContentSizeChange={(w, h) => setContentHeight(h)}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          {/* Título dentro del recuadro */}
          <View style={styles.stickyHeader}>
            <Text style={styles.sectionTitleMenu}>
              Información complementaria de cada categoría
            </Text>
          </View>

          {categories.map((cat) => (
            <Pressable
              key={cat.name}
              style={[styles.button, { backgroundColor: cat.color }]}
              onPress={() => setSelected(cat.name)}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: cat.name === "Inicio" ? "white" : "black" },
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </Animated.ScrollView>

        {/* Difuminado inferior */}
        <LinearGradient
          colors={["rgba(255,255,255,0)", "white"]}
          style={[styles.gradientOverlay, { bottom: 0 }]}
          pointerEvents="none"
        />
      </View>

      {/* Modal */}
      <Modal visible={!!selected} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <ScrollView style={{ maxHeight: "80%" }}>
              <Text style={styles.modalTitle}>{selected}</Text>
              <Text style={styles.modalText}>
                El sangrado puede ser nulo, local o a distancia. En caso de sangrado a distancia se espera encontrar alteraciones que indiquen envenenamiento sistémico, tales como las siguientes:
              </Text>
              <View style={{ paddingLeft: 10, marginVertical: 5 }}>
                <Text style={styles.bullet}>• Gingivorragia (sangrado en las encías)</Text>
                <Text style={styles.bullet}>• Epistaxis (sangrado nasal)</Text>
                <Text style={styles.bullet}>• Hematuria (orina sanguinolenta)</Text>
                <Text style={styles.bullet}>• Melena o hematemesis (tracto gastrointestinal)</Text>
                <Text style={styles.bullet}>• Equimosis o petequias en piel no relacionada con la mordedura</Text>
                <Text style={styles.bullet}>• Sangrado conjuntival o subconjuntival</Text>
                <Text style={styles.bullet}>• Sangrado en sitios de venopunción</Text>
              </View>
              <Text style={styles.modalText}>
                En casos graves se puede generar compromiso hemodinámico, lo cual incluye estado de shock hipovolémico, coagulación intravascular diseminada e incluso sangrado en el sistema nervioso central.
              </Text>
              <Image
                source={require("../../assets/images/placeholder.png")}
                style={{ width: "100%", height: 200, marginTop: 15, borderRadius: 10 }}
                resizeMode="cover"
              />
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

// ====================== ESTILOS ======================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d7ebe4",
    alignItems: "center",
    paddingTop: 40,
  },
  diagramBackground: {
    backgroundColor: "#d7ebe4",
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    position: "absolute",
    top: 40,
    zIndex: 20,
  },
  rotationControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  resetButton: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  rotationText: {
    fontSize: 16,
    color: "#007aff",
    fontWeight: "bold",
    marginHorizontal: 6,
  },
  rotationTextCenter: {
    fontSize: 16,
    color: "#007aff",
    fontWeight: "bold",
    marginHorizontal: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#007aff",
    paddingHorizontal: 8,
  },
  menuContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    position: "relative",
  },
  menu: {
    flex: 1,
    width: "96%",
    alignSelf: "center",
  },
  stickyHeader: {
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 5,
  },
  sectionTitleMenu: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00786b",
    textAlign: "center",
  },
  button: {
    width: "85%",
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 35,
    zIndex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#cce7ff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  bullet: {
    fontSize: 14,
    marginBottom: 2,
  },
  close: {
    color: "blue",
    textAlign: "right",
    marginTop: 10,
  },
});
