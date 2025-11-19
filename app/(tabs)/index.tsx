import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
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
  const [menuHeight, setMenuHeight] = useState(Dimensions.get("window").height * 0.5);
  const [menuState, setMenuState] = useState<"normal" | "full" | "min">("normal");
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const zoomRef = useRef<any>(null);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const size = screenWidth * 0.8;

  const categories = [
    { name: "Inicio", color: "#0a0a0aff" },
    { name: "Neurotoxicidad", color: "#d64fc4" },
    { name: "Reacción vagal", color: "#c7d5ef" },
    { name: "Clasificación del edema", color: "#fff7ea" },
    { name: "Daño tisular local", color: "#a5f2ff" },
    { name: "Coagulación y circulación sistémica", color: "#ffc6f6" },
    { name: "Alteraciones renales cualitativas", color: "#fff1b4" },
    { name: "Exámenes paraclínicos complementarios", color: "#8eefdd" },
    { name: "Clasificación y tratamiento", color: "#40bdbc" },
  ];

  // ================= CORRECCIÓN =================
  type Bullet =
    | { type: "bullet"; bold?: string; rest?: string; image?: any }
    | { type: "subBullet"; bold?: string; rest?: string; image?: any } // bold agregado
    | { type: "text"; text: string; image?: any }
    | { type: "string"; value: string };

  const categoryInfo: Record<string, { text: string; bullets?: Bullet[]; image?: any }> = {
    Inicio: {
      text: "Tenga en cuenta la información que se presenta a continuación.",
      bullets: [
        { type: "string", value: "Los síntomas descritos para cada categoría NO se presentarán necesariamente al mismo tiempo." },
        { type: "string", value: "Las principales familias de serpientes venenosas de significancia clínica en Colombia son víboras (Bothrops, cascabel, Lachesis) y elápidos (coral, marina)." },
        { type: "string", value: "El tipo de suero antiofídico (antídoto) y la dosis a administrar dependen de la familia de la serpiente involucrada (víbora, elápido), y la gravedad clínica del envenenamiento (leve, moderado o grave)." },
        { type: "string", value: "Dejar al paciente con sospecha de accidente ofídico en observación por 6-12 horas y evaluar la progresividad de los síntomas." },
        { type: "string", value: "Toda mordedura en cuello, cara o tronco debe ser tratada como grave." },
        { type: "string", value: "Accidentes por serpientes venenosas diferentes a víboras y elápidos NO se consideran de significancia clínica, por lo cual NO requieren de suero antiofídico." },
        { type: "string", value: "En algunos casos se presentan 'mordeduras secas' por parte de serpientes venenosas, lo cual significa que no se inocula veneno. Es necesario monitorear la aparición de síntomas para decidir la necesidad de aplicar suero antiofídico." },
      ],
    },
    Neurotoxicidad: {
      text: "Los efectos neurotóxicos pueden dividirse según su severidad.",
      bullets: [
        { type: "bullet", bold: "🟢 Leve:", rest: " Mareo, visión borrosa, fotofobia, adormecimiento local, parestesias, náusea, vómito." },
        { type: "bullet", bold: "🟡 Moderado:", rest: " Parestesias, mialgias leves, náusea, vómito, ptosis palpebral, alteraciones de la visión, oftalmoplejía, fascies miasténica (Rosenfeld), astenia, disartria." },
        { type: "bullet", bold: "🔴 Grave:", rest: " Parálisis progresiva, compromiso respiratorio, falla ventilatoria." },
      ],
    },
    "Reacción vagal": {
      text: "En mordedura por Lachesis puede haber estimulación persistente del nervio vago, pero cuadros similares pueden ocurrir por estrés, miedo o dolor intenso.",
      bullets: [
        { type: "string", value: "Bradicardia" },
        { type: "string", value: "Diarrea profusa" },
        { type: "string", value: "Hipotensión" },
        { type: "string", value: "Mareo" },
        { type: "string", value: "Alteraciones de la conciencia" },
        { type: "string", value: "Diaforesis" },
        { type: "string", value: "Palidez marcada" },
        { type: "string", value: "Náuseas y vómito" },
        { type: "string", value: "Visión borrosa" },
      ],
      image: require("../../assets/images/vagales.png")
    },
    "Clasificación del edema": {
      text: "El edema se clasifica según su extensión y progresividad.",
      bullets: [
        { type: "bullet", bold: "🟩⬜⬜⬜ Perilesional no progresivo:", rest: "Afectación local no progresiva. Tiende a disminuir o desaparecer después de 6 horas." },
        { type: "bullet", bold: "🟩🟩⬜⬜ Leve progresivo:", rest: "1–2 segmentos en la extremidad, diferencia de diámetro ≤ 4 cm, sin compromiso del tronco." },
        { type: "bullet", bold: "🟨🟨🟨⬜ Moderado progresivo:", rest: "2–3 segmentos, diferencia de diámetro > 4 cm, sin compromiso del tronco." },
        { type: "bullet", bold: "🟥🟥🟥🟥 Grave progresivo:", rest: "3 o más segmentos, compromiso del tronco, tendencia a avanzar con el tiempo." },
        { type: "text", text: "Segmentos corporales:" },
      ],
      image: require("../../assets/images/segmentos.png")
    },
    "Daño tisular local": {
      text: "A continuación se presentan algunos ejemplos reales de afecciones locales:",
      bullets: [
        { type: "text", text: "A) Lesión paralesional leve (Bothrops)", image: require("../../assets/images/edema.png") },
        { type: "text", text: "B) Equimosis severa (Bothrops)", image: require("../../assets/images/equimosis.png") },
        { type: "text", text: "C) Flictenas serohemáticas (Bothrops)", image: require("../../assets/images/flictenas.png") },
        { type: "text", text: "D) Necrosis extensa (Bothrops)", image: require("../../assets/images/necrosis.png") },
        { type: "text", text: "E) Lesiones mecánicas aserradas (serpiente no venenosa)", image: require("../../assets/images/boa.png") },
      ],
    },
    "Coagulación y circulación sistémica": {
      text: "Pruebas de coagulación y alteraciones hemodinámicas",
      bullets: [
        { type: "bullet", bold: "1) COAGULACIÓN" },
        { 
          type: "subBullet", 
          bold: "En campo: prueba Todo o nada", 
          rest: "Recolectar 5 cc de sangre venosa dentro de un tubo de ensayo seco sin anticoagulantes. Homogenizar y dejar en reposo por 20 minutos a 37°C.", 
          image: require("../../assets/images/todo_nada.png") 
        },
        { 
          type: "subBullet", 
          bold: "En clínica equipada", 
          rest: "Indicadores de coagulopatía:\n- Tiempo de protrombina (TP) ↑\n- Tiempo de tromboplastina parcial (TPT) ↑\n- Índice internacional normalizado (INR) ↑" 
        },
        { type: "bullet", bold: "2) ALTERACIONES HEMODINÁMICAS", rest: "El sangrado puede ser nulo, local o a distancia. En caso de sangrado a distancia se espera encontrar alteraciones que indiquen envenenamiento sistémico:" },
        { 
          type: "subBullet", 
          bold: "Signos a distancia", 
          rest: "• Gingivorragia\n• Epistaxis (más común en Lachesis que Bothrops)\n• Hematuria\n• Melena o hematemesis\n• Hematoquecia\n• Equimosis o petequias\n• Sangrado conjuntival o subconjuntival\n• Sangrado en sitios de venopunción\n• Hipotensión secundaria a hemorragia\n• Anemia", 
          image: require("../../assets/images/hemodinamicas.png") 
        },
        { type: "bullet", bold: "3) CASOS GRAVES", rest: "Se puede generar compromiso hemodinámico, incluyendo estado de shock hipovolémico, coagulación intravascular diseminada e incluso sangrado en el sistema nervioso central." },
      ],
    },

    "Alteraciones renales cualitativas": {
      text: "La función renal puede verse alterada tras un envenenamiento ofídico. Los signos incluyen:",
      bullets: [
        { type: "bullet", bold: "Hematuria y falla renal:", rest: "El envenenamiento bothrópico puede causar hematuria y falla renal en casos graves." },
        { type: "bullet", bold: "Mioglobinuria:", rest: "Típica de cascabeles y serpiente marina debido a procesos de rabdomiólisis, resultando en orina de tonalidad oscura." },
        { type: "bullet", bold: "Distinción mioglobinuria VS hematuria:", rest: "En Crótalo se puede presentar coloración en la orina por hematuria y/o principalmente mioglobinuria, mientras que en Bothrops es más común que los cambios de coloración ocurran por hematuria." },
      ],
    },
    "Exámenes paraclínicos complementarios": {
      text: "Se pueden realizar exámenes de laboratorio adicionales según la disponibilidad:",
      image: require("../../assets/images/paraclinicos.png")
    },
    "Clasificación y tratamiento": {
      text: "El tratamiento depende de la gravedad clínica y la especie de serpiente:",
      image: require("../../assets/images/tratamiento.png")
    },
  };

  const handleResetZoom = () => setResetTrigger((p) => p + 1);
  const handleResetRotation = () => setRotation(0);
  const handleZoomChange = (scale: number) => setIsZoomed(scale > 1.05);

  const renderBullet = (item: Bullet, isLast: boolean, level = 0, key?: number) => {
    const marginLeft = level * 20;
    const spacing = 6;

    if (item.type === "bullet") {
      return (
        <View key={key} style={[styles.bulletRow, { marginBottom: spacing, marginLeft }]}>
          <Text style={styles.bulletDot}>•</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bulletText}>
              <Text style={styles.bulletBold}>{item.bold}</Text>
              {"\n"}
              {item.rest}
            </Text>
            {item.image && (
              <ImageZoom
                cropWidth={screenWidth * 0.75}
                cropHeight={screenHeight * 0.35}
                imageWidth={screenWidth * 0.7}
                imageHeight={screenWidth * 0.7}
              >
                <Animated.Image
                  source={item.image}
                  style={{ width: screenWidth * 0.7, height: screenWidth * 0.7, borderRadius: 10, marginTop: 6 }}
                  resizeMode="contain"
                />
              </ImageZoom>
            )}
          </View>
        </View>
      );
    }

    if (item.type === "subBullet") {
      const marginLeftSub = (level + 1) * 20;
      return (
        <View key={key} style={[styles.subBulletRow, { marginBottom: 6, marginLeft: marginLeftSub }]}>
          <Text style={styles.subBulletDot}>➤</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.subBulletText}>
              {item.bold && <Text style={{ fontWeight: "bold" }}>{item.bold}</Text>}
              {"\n"}
              {item.rest}
            </Text>
            {item.image && (
              <ImageZoom
                cropWidth={screenWidth * 0.7}
                cropHeight={screenHeight * 0.3}
                imageWidth={screenWidth * 0.65}
                imageHeight={screenWidth * 0.65}
              >
                <Animated.Image
                  source={item.image}
                  style={{ width: screenWidth * 0.65, height: screenWidth * 0.65, borderRadius: 10, marginTop: 6 }}
                  resizeMode="contain"
                />
              </ImageZoom>
            )}
          </View>
        </View>
      );
    }


    if (item.type === "text") {
      const isInciso = /^[A-E]\)/.test(item.text);
      return (
        <View key={key} style={{ marginBottom: spacing, marginLeft }}>
          <Text style={[styles.bulletText, isInciso && { fontWeight: "bold" }]}>{item.text}</Text>
          {item.image && (
            <ImageZoom
              cropWidth={screenWidth * 0.75}
              cropHeight={screenHeight * 0.35}
              imageWidth={screenWidth * 0.7}
              imageHeight={screenWidth * 0.7}
            >
              <Animated.Image
                source={item.image}
                style={{ width: screenWidth * 0.7, height: screenWidth * 0.7, borderRadius: 10, marginTop: 6 }}
                resizeMode="contain"
              />
            </ImageZoom>
          )}
        </View>
      );
    }

    if (item.type === "string") {
      return (
        <View key={key} style={[styles.bulletRow, { marginBottom: spacing, marginLeft }]}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item.value}</Text>
        </View>
      );
    }
  };

  const dragPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newHeight = menuHeight - gesture.dy;
        if (newHeight < 100) newHeight = 100;
        if (newHeight > screenHeight - 100) newHeight = screenHeight - 100;
        setMenuHeight(newHeight);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* 🔹 Controles de rotación y zoom */}
      <View style={styles.topControls}>
        <View style={styles.rotationControls}>
          <TouchableOpacity onPress={() => setRotation((r) => r - 30)}>
            <Text style={styles.rotationText}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetRotation}>
            <Text style={[styles.rotationTextCenter, { color: rotation === 0 ? "#888" : "#40bdbc" }]}>0°</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRotation((r) => r + 30)}>
            <Text style={styles.rotationText}>↻</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: isZoomed ? "white" : "#e0e0e0" }]}
          onPress={handleResetZoom}
        >
          <Maximize2 size={20} color={isZoomed ? "#40bdbc" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Diagrama */}
      <View style={styles.diagramBackground}>
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
          onMove={(e: any) => handleZoomChange(e.scale)}
        >
          <Animated.Image
            source={require("../../assets/images/rueda_png.png")}
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

      {/* 🔹 Menú blanco arrastrable */}
      {menuState !== "min" && (
        <View style={[styles.menuContainer, { height: menuHeight }]}>
          <View style={styles.dragBar} {...dragPanResponder.panHandlers}>
            <Text style={{ fontSize: 16, color: "#00786b" }}>↕ Arrastra aquí</Text>
          </View>

          <ScrollView
            style={{ flex: 1, marginTop: 10 }}
            contentContainerStyle={{ paddingVertical: 10, alignItems: "center", paddingRight: 4 }}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.sectionTitleMenu}>Información complementaria de cada categoría</Text>
            {categories.map((cat) => (
              <Pressable
                key={cat.name}
                style={[styles.button, { backgroundColor: cat.color }]}
                onPress={() => setSelected(cat.name)}
              >
                <Text style={[styles.buttonText, { color: cat.name === "Inicio" ? "white" : "black" }]}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🔹 Modal */}
      <Modal visible={!!selected} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <ScrollView style={{ maxHeight: "80%" }}>
              {selected && (
                <>
                  <Text style={styles.modalTitle}>{selected}</Text>
                  <Text style={styles.modalText}>{categoryInfo[selected]?.text}</Text>
                  {categoryInfo[selected]?.bullets?.map((item, i) =>
                    renderBullet(item, i === categoryInfo[selected]!.bullets!.length - 1, 0, i)
                  )}
                  {categoryInfo[selected]?.image && selected !== "Daño tisular local" && (
                    <ImageZoom
                      cropWidth={screenWidth * 0.75}
                      cropHeight={screenHeight * 0.35}
                      imageWidth={screenWidth * 0.7}
                      imageHeight={screenWidth * 0.7}
                    >
                      <Animated.Image
                        source={categoryInfo[selected]?.image}
                        style={{ width: screenWidth * 0.7, height: screenWidth * 0.7, alignSelf: "center", borderRadius: 10, marginTop: 8 }}
                        resizeMode="contain"
                      />
                    </ImageZoom>
                  )}
                </>
              )}
            </ScrollView>
            <Text style={styles.close} onPress={() => setSelected(null)}>Cerrar</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ====================== ESTILOS ======================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d7ebe4", alignItems: "center", paddingTop: 40 },
  diagramBackground: { backgroundColor: "#d7ebe4", width: "100%", paddingVertical: 10, alignItems: "center", marginBottom: 10 },
  topControls: { flexDirection: "row", justifyContent: "space-between", width: "90%", position: "absolute", top: 40, zIndex: 20 },
  rotationControls: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 25, paddingHorizontal: 10, paddingVertical: 6, elevation: 4 },
  resetButton: { borderRadius: 25, padding: 8, elevation: 4 },
  rotationText: { fontSize: 16, fontWeight: "bold", marginHorizontal: 6, color: "#40bdbc" },
  rotationTextCenter: { fontSize: 16, fontWeight: "bold", marginHorizontal: 8, borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#40bdbc", paddingHorizontal: 8 },
  menuContainer: { flex: 1, width: "100%", backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 0 },
  dragBar: { height: 40, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#e0f2f1", borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sectionTitleMenu: { fontSize: 16, fontWeight: "600", color: "#00786b", marginBottom: 8 },
  button: { width: "85%", paddingVertical: 14, borderRadius: 10, marginVertical: 6, alignItems: "center", elevation: 2 },
  buttonText: { fontWeight: "bold", textAlign: "center" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#ffffffff", padding: 20, borderRadius: 10, width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalText: { fontSize: 15, marginBottom: 6, color: "#333" },
  close: { color: "blue", textAlign: "right", marginTop: 10, fontSize: 16 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, marginLeft: 5 },
  bulletDot: { fontSize: 20, lineHeight: 22, marginRight: 8, color: "#00786b" },
  bulletText: { flex: 1, fontSize: 16, lineHeight: 22, color: "#222" },
  bulletBold: { fontWeight: "bold", color: "#000" },
  subBulletRow: { flexDirection: "row", alignItems: "flex-start" },
  subBulletDot: { fontSize: 18, lineHeight: 22, marginRight: 8, color: "#40bdbc" },
  subBulletText: { fontSize: 15, lineHeight: 20, color: "#555" },
});
