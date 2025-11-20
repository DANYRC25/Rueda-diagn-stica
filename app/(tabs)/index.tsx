import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// @ts-ignore
import { LinearGradient } from "expo-linear-gradient";
import { Maximize2 } from "lucide-react-native";
import ImageZoom from "react-native-image-pan-zoom";

export default function HomeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [menuState, setMenuState] = useState<"normal" | "full" | "min">("min");
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

  type Bullet =
    | { type: "bullet"; bold?: string; rest?: string; image?: any }
    | { type: "subBullet"; bold?: string; rest?: string; image?: any }
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
      text: "En casos de mordedura por Lachesis típicamente hay una estimulación persistente e intensa del nervio vago.",
      bullets: [
        {
          type: "string",
          value: "Sin embargo, cuadros vagales similares también pueden presentarse en ausencia de envenenamiento o en otros accidentes ofídicos, debido a factores como estrés, miedo o dolor intenso. Es esencial diferenciar la causa y determinar si la respuesta es transitoria (más frecuente en reacciones emocionales o dolorosas), o si es pronunciada y sostenida, lo cual se suele asociar al veneno de Lachesis. A continuación se presentan algunos síntomas típicos de reacción vagal:"
        },
        { type: "subBullet", rest: "Bradicardia" },
        { type: "subBullet", rest: "Diarrea profusa" },
        { type: "subBullet", rest: "Hipotensión" },
        { type: "subBullet", rest: "Mareo" },
        { type: "subBullet", rest: "Alteraciones de la conciencia" },
        { type: "subBullet", rest: "Diaforesis" },
        { type: "subBullet", rest: "Palidez marcada" },
        { type: "subBullet", rest: "Náuseas y vómito" },
        { type: "subBullet", rest: "Visión borrosa" },
      ],
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
          rest: "Recolectar 5 cc de sangre venosa dentro de un tubo de ensayo seco sin anticoagulantes. Homogenizar y dejar en reposo por 20 minutos a 37°C. Si la sangre NO se coagula, esto es indicativo de hemotoxicidad. En cambio, si se coagula indica que no hay alteraciones hemotóxicas.", 
          //image: require("../../assets/images/todo_nada.png") 
        },
        { 
          type: "subBullet", 
          bold: "En clínica equipada", 
          rest: "Indicadores de coagulopatía:\n- Tiempo de protrombina (TP) ↑\n- Tiempo de tromboplastina parcial (TPT) ↑\n- Índice internacional normalizado (INR) ↑" 
        },
        { type: "bullet", bold: "2) ALTERACIONES HEMODINÁMICAS", rest: "El sangrado puede ser nulo, local o a distancia. En caso de sangrado a distancia se espera encontrar alteraciones que indiquen envenenamiento sistémico:" },
        { 
          type: "subBullet", 
          bold: "Signos de sangrado a distancia", 
          rest: "• Gingivorragia\n• Epistaxis (más común en Lachesis que Bothrops)\n• Hematuria\n• Melena o hematemesis\n• Hematoquecia\n• Equimosis o petequias\n• Sangrado conjuntival o subconjuntival\n• Sangrado en sitios de venopunción\n• Hipotensión secundaria a hemorragia\n• Anemia", 
          //image: require("../../assets/images/hemodinamicas.png") 
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
  const spacing = 6; // espacio entre items
  const baseMargin = 5; // margen base para bullets principales

  if (item.type === "bullet") {
    const marginLeft = baseMargin + level * 20;
    return (
      <View key={key} style={[styles.bulletRow, { marginBottom: spacing, marginLeft }]}>
        <Text style={styles.bulletDot}>•</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bulletText}>
            <Text style={styles.bulletBold}>{item.bold}</Text>
            {item.rest && "\n"}
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
    const marginLeft = baseMargin + (level + 1) * 20; // sub-bullet un nivel más adentro
    return (
      <View key={key} style={[styles.subBulletRow, { marginBottom: spacing, marginLeft }]}>
        <Text style={styles.subBulletDot}>➤</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.subBulletText}>
            {item.bold && <Text style={{ fontWeight: "bold" }}>{item.bold}</Text>}
            {item.bold && "\n"}
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
    const isSpecial = item.text === "Segmentos corporales:";

    return (
      <View key={key} style={{ marginBottom: spacing, marginLeft: baseMargin + level * 20 }}>
        <Text
          style={[
            styles.bulletText,
            isInciso && { fontWeight: "bold" },
            isSpecial && { fontWeight: "bold", color: "#477576" },
          ]}
        >
          {item.text}
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
    );
  }

  if (item.type === "string") {
    const marginLeft = baseMargin + level * 20;
    return (
      <View key={key} style={[styles.bulletRow, { marginBottom: spacing, marginLeft }]}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{item.value}</Text>
      </View>
    );
  }
};


  

  const menuAnim = useRef(new Animated.Value(60)).current; // altura del menú en versión mínima

  const toggleMenu = () => {
    let toValue = screenHeight * 0.45;
    let nextState: typeof menuState = "normal";

    if (menuState === "normal") {
      toValue = screenHeight * 0.85;
      nextState = "full";
    } else if (menuState === "full") {
      toValue = 60;
      nextState = "min";
    } else {
      toValue = screenHeight * 0.23;
      nextState = "normal";
    }

    Animated.timing(menuAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setMenuState(nextState);
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Controles de rotación y zoom */}
      <View style={styles.topControls}>
        <View style={styles.rotationControls}>
          <TouchableOpacity onPress={() => setRotation((r) => r - 30)}>
            <Text style={styles.rotationText}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetRotation}>
            <Text style={[styles.rotationTextCenter, { color: rotation === 0 ? "#888" : "#477576" }]}>0°</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRotation((r) => r + 30)}>
            <Text style={styles.rotationText}>↻</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: isZoomed ? "white" : "#e0e0e0" }]}
          onPress={handleResetZoom}
        >
          <Maximize2 size={27} color={isZoomed ? "#477576" : "#888"} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Diagrama */}
      <View style={styles.diagramBackground}>
        <ImageZoom
          key={resetTrigger}
          ref={zoomRef}
          cropWidth={screenWidth}
          cropHeight={screenHeight * 0.8}
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

      {/* 🔹 Menú */}
      <Animated.View
        style={[styles.menuContainer, { height: menuAnim, position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 100 }]}
      >
        <TouchableOpacity style={styles.dragBar} onPress={toggleMenu}>
          <Text style={{ fontSize: 16, color: "#ffffffff" }}>
            {menuState === "normal"
              ? "⬆ Maximizar"
              : menuState === "full"
              ? "⬇ Minimizar"
              : "⬆ Abrir información complementaria"}
          </Text>
        </TouchableOpacity>

        {menuState !== "min" && (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1, marginTop: 10 }}
              contentContainerStyle={{ paddingVertical: 10, alignItems: "center", paddingRight: 4 }}
              showsVerticalScrollIndicator={true}
              scrollIndicatorInsets={{ right: 1 }}
            >
              {/* 🔹 Botones de categorías */}
              <View style={{ marginTop: 15, width: "90%" }}>
                {categories.map((c) => (
                  <TouchableOpacity key={c.name} onPress={() => setSelected(c.name)} style={{ marginVertical: 6 }}>
                    <View style={[styles.button, { backgroundColor: c.color }]}>
                      <Text style={[styles.buttonText, { color: c.name === "Inicio" ? "#fff" : "#000" }]}>{c.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* 🔹 Gradiente siempre en la base */}
            <LinearGradient
              colors={["transparent", "#d7ebe4"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: screenHeight * 0.05,
                pointerEvents: "none", // permite interactuar con ScrollView debajo
              }}
            />
          </View>
        )}
      </Animated.View>


      {/* 🔹 Modal pop-up para info */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            width: "85%",
            maxHeight: "80%",
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
          }}>
            <ScrollView>
              <Text style={styles.sectionTitleMenu}>{categoryInfo[selected!]?.text}</Text>
              {categoryInfo[selected!]?.bullets?.map((b, i) =>
                renderBullet(b, i === categoryInfo[selected!].bullets!.length - 1, 0, i)
              )}

              {categoryInfo[selected!]?.image && (
                <ImageZoom
                  cropWidth={screenWidth * 0.8}     // ancho del "viewport" para hacer zoom
                  cropHeight={screenHeight * 0.5}   // alto del "viewport"
                  imageWidth={screenWidth * 0.75}   // ancho de la imagen original
                  imageHeight={screenWidth * 0.75}  // alto de la imagen original
                >
                  <Animated.Image
                    source={categoryInfo[selected!].image}
                    style={{ width: screenWidth * 0.75, height: screenWidth * 0.75, borderRadius: 10, marginTop: 10 }}
                    resizeMode="contain"
                  />
                </ImageZoom>
              )}

            </ScrollView>
            <TouchableOpacity
              style={{ marginTop: 10, alignSelf: "center", padding: 8 }}
              onPress={() => setSelected(null)}
            >
              <Text style={{ color: "#477576", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ====================== ESTILOS ======================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d7ebe4", alignItems: "center", paddingTop: 40 },
  diagramBackground: { backgroundColor: "#d7eee7", width: "100%", paddingVertical: 10, alignItems: "center", marginBottom: 10 },
  topControls: { flexDirection: "row", justifyContent: "space-between", width: "90%", position: "absolute", top: 40, zIndex: 20 },
  rotationControls: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 25, paddingHorizontal: 10, paddingVertical: 6, elevation: 4 },
  resetButton: { borderRadius: 25, padding: 8, elevation: 4 },
  rotationText: { fontSize: 23, fontWeight: "bold", marginHorizontal: 6, color: "#477576" },
  rotationTextCenter: { fontSize: 23, fontWeight: "bold", marginHorizontal: 8, borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#477576", paddingHorizontal: 8 },
  menuContainer: { width: "100%", backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" },
  dragBar: { height: 52, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "#477576", borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 50, elevation: 6 },
  sectionTitleMenu: { fontSize: 16, fontWeight: "600", color: "#477576", marginBottom: 8 },
  button: { width: "100%", paddingVertical: 16, borderRadius: 10, alignItems: "center", alignSelf: "center", elevation: 2 },
  buttonText: { fontWeight: "bold", textAlign: "center" },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, marginLeft: 5 },
  bulletDot: { fontSize: 50, lineHeight: 22, marginRight: 8, color: "#477576" },
  bulletText: { flex: 1, fontSize: 16, lineHeight: 22, color: "#222" },
  bulletBold: { fontWeight: "bold", color: "#000" },
  subBulletRow: { flexDirection: "row", alignItems: "flex-start" },
  subBulletDot: { fontSize: 18, lineHeight: 22, marginRight: 8, color: "#477576" },
  subBulletText: { fontSize: 15, lineHeight: 20, color: "#555" },
});
