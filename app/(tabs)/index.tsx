import React, { useRef, useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Colores de las 9 donas
const COLORS = [
  '#EF4444',
  '#F97316',
  '#FACC15',
  '#4ADE80',
  '#22D3EE',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#A855F7',
];

export default function DiagramaInteractivo() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const lastPan = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value) },
      { translateY: withTiming(translateY.value) },
      { scale: withTiming(scale.value) },
    ],
  }));

  const handlePress = (index: number) => {
    setSelected(index);
    setModalVisible(true);
  };

  // --- Web Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    scale.value = scale.value * delta;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    lastPan.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    translateX.value += dx;
    translateY.value += dy;
    lastPan.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const handleDoubleClickWeb = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const dx = offsetX - 500;
    const dy = offsetY - 500;
    const dist = Math.sqrt(dx * dx + dy * dy);
    COLORS.forEach((_, i) => {
      const r = 100 + i * 40;
      const halfStroke = 17.5;
      if (dist >= r - halfStroke && dist <= r + halfStroke) {
        handlePress(i);
      }
    });
  };

  return (
    <View
      style={styles.container}
      {...(Platform.OS === 'web'
        ? {
            onWheel: handleWheel,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
          }
        : {})}
    >
      {Platform.OS === 'web' ? (
        <div style={{ width: '100%', height: '100vh' }} onDoubleClick={handleDoubleClickWeb}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <Svg width="100%" height="100%" viewBox="0 0 1000 1000">
              {COLORS.map((color, i) => (
                <Circle
                  key={i}
                  cx={500}
                  cy={500}
                  r={100 + i * 40}
                  stroke={color}       // color visible de la dona
                  strokeWidth={35}     // grosor de la dona
                  fill="transparent"   // hueco central
                />
              ))}
            </Svg>
          </Animated.View>
        </div>
      ) : (
        <PanGestureHandler
          onGestureEvent={(e) => {
            translateX.value += e.nativeEvent.translationX;
            translateY.value += e.nativeEvent.translationY;
          }}
        >
          <PinchGestureHandler
            onGestureEvent={(e) => {
              scale.value = e.nativeEvent.scale;
            }}
          >
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
              <Svg width="100%" height="100%" viewBox="0 0 1000 1000">
                {COLORS.map((color, i) => (
                  <TapGestureHandler
                    key={i}
                    numberOfTaps={2}
                    onHandlerStateChange={(event) => {
                      if (event.nativeEvent.state === State.ACTIVE) {
                        handlePress(i);
                      }
                    }}
                  >
                    <Animated.View>
                      <Circle
                        cx={500}
                        cy={500}
                        r={100 + i * 40}
                        stroke={color}
                        strokeWidth={35}
                        fill="transparent"
                      />
                    </Animated.View>
                  </TapGestureHandler>
                ))}
              </Svg>
            </Animated.View>
          </PinchGestureHandler>
        </PanGestureHandler>
      )}

      {/* Modal de información */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selected !== null && (
              <>
                <Text style={styles.modalTitle}>Dona {selected + 1}</Text>
                <ScrollView style={{ maxHeight: 250 }}>
                  <Text style={styles.modalText}>
                    Información detallada sobre la dona {selected + 1}. Puedes incluir texto, imágenes o datos relevantes.
                  </Text>
                </ScrollView>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 14, marginBottom: 10, textAlign: 'justify' },
  closeButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  closeText: { color: '#fff', fontWeight: 'bold' },
});


