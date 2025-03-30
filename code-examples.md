# 축구레슨 매칭 플랫폼 (SoccerCoachFinder) - 코드 예제

## 1. App.js (진입점)

```jsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 네비게이션
import AuthNavigator from './src/navigation/AuthNavigator';
import ParentNavigator from './src/navigation/ParentNavigator';
import CoachNavigator from './src/navigation/CoachNavigator';

// 상태 관리
import { useAuthStore } from './src/stores/authStore';

// 다국어 설정
import './src/localization/i18n';

// Splash 화면 유지
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { isAuthenticated, userRole } = useAuthStore();
  const [appIsReady, setAppIsReady] = useState(false);

  // 폰트 로드
  const [fontsLoaded] = useFonts({
    'NotoSansKR-Regular': require('./assets/fonts/NotoSansKR-Regular.otf'),
    'NotoSansKR-Medium': require('./assets/fonts/NotoSansKR-Medium.otf'),
    'NotoSansKR-Bold': require('./assets/fonts/NotoSansKR-Bold.otf'),
  });

  // 앱 초기화
  useEffect(() => {
    async function prepare() {
      try {
        // 앱 초기화 작업 (ex: 데이터 로드, API 호출 등)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {!isAuthenticated ? (
          <AuthNavigator />
        ) : userRole === 'parent' ? (
          <ParentNavigator />
        ) : (
          <CoachNavigator />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

## 2. 인증 스토어 (Zustand)

```jsx
// src/stores/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  userRole: null,
  isLoading: false,
  error: null,

  // 초기화
  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        set({
          token,
          user: response.data,
          isAuthenticated: true,
          userRole: response.data.role,
        });
      }
    } catch (error) {
      await AsyncStorage.removeItem('token');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        userRole: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 로그인
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      
      set({
        token,
        user,
        isAuthenticated: true,
        userRole: user.role,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || '로그인에 실패했습니다.',
        isLoading: false,
      });
      return false;
    }
  },

  // 회원가입
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      
      set({
        token,
        user,
        isAuthenticated: true,
        userRole: user.role,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || '회원가입에 실패했습니다.',
        isLoading: false,
      });
      return false;
    }
  },

  // 로그아웃
  logout: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem('token');
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        userRole: null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
```

## 3. API 클라이언트 설정

```jsx
// src/api/index.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-api-url.replit.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 오류
      await AsyncStorage.removeItem('token');
      // 로그인 화면으로 리디렉션 로직...
    }
    return Promise.reject(error);
  }
);

export default api;

// API 함수들
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const coachAPI = {
  getCoaches: (params) => api.get('/coaches', { params }),
  getCoachById: (id) => api.get(`/coaches/${id}`),
  getNearbyCoaches: (location) => api.get('/coaches/nearby', { params: location }),
  createCoachProfile: (data) => api.post('/coaches', data),
  updateCoachProfile: (id, data) => api.put(`/coaches/${id}`, data),
  uploadCertification: (id, data) => api.post(`/coaches/${id}/certifications`, data),
  uploadGalleryImage: (id, data) => api.post(`/coaches/${id}/gallery`, data),
};

export const lessonAPI = {
  getLessons: (params) => api.get('/lessons', { params }),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  requestLesson: (data) => api.post('/lessons', data),
  updateLessonStatus: (id, status) => api.put(`/lessons/${id}/status`, { status }),
};

export const chatAPI = {
  getChats: () => api.get('/chats'),
  getChatById: (id) => api.get(`/chats/${id}`),
  createChat: (participantId) => api.post('/chats', { participantId }),
  getMessages: (chatId) => api.get(`/chats/${chatId}/messages`),
  sendMessage: (chatId, content) => api.post(`/chats/${chatId}/messages`, { content }),
};
```

## 4. 학부모 네비게이션

```jsx
// src/navigation/ParentNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// 화면
import ParentHomeScreen from '../screens/parent/ParentHomeScreen';
import CoachListScreen from '../screens/parent/CoachListScreen';
import CoachDetailScreen from '../screens/parent/CoachDetailScreen';
import LessonRequestScreen from '../screens/parent/LessonRequestScreen';
import BookingsScreen from '../screens/parent/BookingsScreen';
import ChatListScreen from '../screens/parent/ChatListScreen';
import ChatDetailScreen from '../screens/parent/ChatDetailScreen';
import ProfileScreen from '../screens/parent/ProfileScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import SettingsScreen from '../screens/common/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 홈 스택
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParentHome" component={ParentHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="CoachDetail" component={CoachDetailScreen} options={{ title: '코치 프로필' }} />
      <Stack.Screen name="LessonRequest" component={LessonRequestScreen} options={{ title: '레슨 요청' }} />
    </Stack.Navigator>
  );
}

// 코치 스택
function CoachStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CoachList" component={CoachListScreen} options={{ title: '코치 찾기' }} />
      <Stack.Screen name="CoachDetail" component={CoachDetailScreen} options={{ title: '코치 프로필' }} />
      <Stack.Screen name="LessonRequest" component={LessonRequestScreen} options={{ title: '레슨 요청' }} />
    </Stack.Navigator>
  );
}

// 레슨 스택
function LessonStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Bookings" component={BookingsScreen} options={{ title: '내 레슨' }} />
      <Stack.Screen name="CoachDetail" component={CoachDetailScreen} options={{ title: '코치 프로필' }} />
    </Stack.Navigator>
  );
}

// 채팅 스택
function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: '채팅' }} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={({ route }) => ({ title: route.params.name })} />
    </Stack.Navigator>
  );
}

// 프로필 스택
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: '내 프로필' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '설정' }} />
    </Stack.Navigator>
  );
}

export default function ParentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Coaches') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Lessons') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'MyProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6b21ff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false, title: '홈' }} />
      <Tab.Screen name="Coaches" component={CoachStack} options={{ headerShown: false, title: '코치' }} />
      <Tab.Screen name="Lessons" component={LessonStack} options={{ headerShown: false, title: '레슨' }} />
      <Tab.Screen name="Chat" component={ChatStack} options={{ headerShown: false, title: '채팅' }} />
      <Tab.Screen name="MyProfile" component={ProfileStack} options={{ headerShown: false, title: '내정보' }} />
    </Tab.Navigator>
  );
}
```

## 5. 코치 프로필 화면

```jsx
// src/screens/parent/CoachDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { coachAPI } from '../../api';
import { LoadingSpinner, ErrorMessage, Rating } from '../../components/common';
import { CoachGallery, CoachReviews, CoachCertifications } from '../../components/coaches';
import { formatCurrency } from '../../utils/formatUtils';

export default function CoachDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { coachId } = route.params;
  
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    fetchCoachDetails();
  }, [coachId]);
  
  const fetchCoachDetails = async () => {
    try {
      setLoading(true);
      const response = await coachAPI.getCoachById(coachId);
      setCoach(response.data);
      setError(null);
    } catch (err) {
      setError('코치 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRequestLesson = () => {
    navigation.navigate('LessonRequest', { coachId: coach._id, coachName: coach.user.name });
  };
  
  const handleStartChat = async () => {
    try {
      const response = await chatAPI.createChat(coach.user._id);
      navigation.navigate('ChatDetail', {
        chatId: response.data._id,
        name: coach.user.name,
      });
    } catch (error) {
      console.error('채팅 시작 오류:', error);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCoachDetails} />;
  if (!coach) return <ErrorMessage message="코치 정보를 찾을 수 없습니다." />;
  
  return (
    <ScrollView className="flex-1 bg-white">
      {/* 코치 프로필 헤더 */}
      <View className="items-center p-4 border-b border-gray-200">
        <Image
          source={{ uri: coach.user.profileImage || 'https://via.placeholder.com/150' }}
          className="w-24 h-24 rounded-full"
        />
        <Text className="mt-2 text-xl font-bold">{coach.user.name} 코치</Text>
        <View className="flex-row items-center mt-1">
          <Rating value={coach.averageRating} />
          <Text className="ml-2 text-gray-600">({coach.reviewCount}개 리뷰)</Text>
        </View>
      </View>
      
      {/* 기본 정보 */}
      <View className="p-4 bg-gray-50">
        <View className="flex-row mb-2">
          <View className="flex-row items-center flex-1">
            <Ionicons name="time-outline" size={20} color="#6b21ff" />
            <Text className="ml-2 text-gray-700">경력: {coach.experience}년</Text>
          </View>
          <View className="flex-row items-center flex-1">
            <Ionicons name="location-outline" size={20} color="#6b21ff" />
            <Text className="ml-2 text-gray-700">{coach.location.address}</Text>
          </View>
        </View>
        <View className="flex-row mb-2">
          <View className="flex-row items-center flex-1">
            <Ionicons name="people-outline" size={20} color="#6b21ff" />
            <Text className="ml-2 text-gray-700">
              {coach.specializations.join(', ')}
            </Text>
          </View>
        </View>
        <View className="flex-row">
          <View className="flex-row items-center flex-1">
            <Ionicons name="cash-outline" size={20} color="#6b21ff" />
            <Text className="ml-2 text-gray-700">
              시간당 {formatCurrency(coach.pricing.hourlyRate)}원
            </Text>
          </View>
        </View>
      </View>
      
      {/* 탭 네비게이션 */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'profile' ? 'border-b-2 border-purple-600' : ''}`}
          onPress={() => setActiveTab('profile')}
        >
          <Text className={`${activeTab === 'profile' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
            프로필
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'reviews' ? 'border-b-2 border-purple-600' : ''}`}
          onPress={() => setActiveTab('reviews')}
        >
          <Text className={`${activeTab === 'reviews' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
            리뷰
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'gallery' ? 'border-b-2 border-purple-600' : ''}`}
          onPress={() => setActiveTab('gallery')}
        >
          <Text className={`${activeTab === 'gallery' ? 'text-purple-600 font-bold' : 'text-gray-600'}`}>
            갤러리
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 탭 컨텐츠 */}
      <View className="p-4">
        {activeTab === 'profile' && (
          <>
            <Text className="mb-2 text-lg font-bold">소개</Text>
            <Text className="mb-4 text-gray-700">{coach.bio}</Text>
            
            <Text className="mb-2 text-lg font-bold">자격증</Text>
            <CoachCertifications certifications={coach.certifications} />
          </>
        )}
        
        {activeTab === 'reviews' && (
          <CoachReviews coachId={coach._id} />
        )}
        
        {activeTab === 'gallery' && (
          <CoachGallery images={coach.gallery} />
        )}
      </View>
      
      {/* 하단 액션 버튼 */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="py-3 mb-2 bg-purple-600 rounded-lg items-center"
          onPress={handleRequestLesson}
        >
          <Text className="text-white font-bold">레슨 요청하기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="py-3 border border-purple-600 rounded-lg items-center"
          onPress={handleStartChat}
        >
          <Text className="text-purple-600 font-bold">채팅 시작하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
```

## 6. 레슨 요청 화면

```jsx
// src/screens/parent/LessonRequestScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { lessonAPI } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { useParentProfileStore } from '../../stores/parentProfileStore';
import { Input, Select, Button, RadioGroup, TextArea, LoadingSpinner } from '../../components/common';
import MapLocationPicker from '../../components/common/MapLocationPicker';
import { formatCurrency } from '../../utils/formatUtils';

// 유효성 검증 스키마
const LessonRequestSchema = Yup.object().shape({
  childId: Yup.string().required('자녀를 선택해주세요'),
  lessonType: Yup.string().required('레슨 유형을 선택해주세요'),
  lessonDate: Yup.date().required('날짜를 선택해주세요').min(new Date(), '오늘 이후 날짜를 선택해주세요'),
  startTime: Yup.string().required('시작 시간을 선택해주세요'),
  duration: Yup.number().required('수업 시간을 선택해주세요'),
  locationChoice: Yup.string().required('장소를 선택해주세요'),
  location: Yup.object().when('locationChoice', {
    is: 'custom',
    then: Yup.object({
      address: Yup.string().required('주소를 입력해주세요'),
      coordinates: Yup.array().of(Yup.number()).min(2, '위치를 선택해주세요')
    })
  }),
  notes: Yup.string().max(500, '요청사항은 500자 이내로 작성해주세요'),
});

export default function LessonRequestScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { coachId, coachName } = route.params;
  
  const { user } = useAuthStore();
  const { profile, children, fetchProfile } = useParentProfileStore();
  
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  useEffect(() => {
    fetchCoachDetails();
    if (!profile) {
      fetchProfile();
    }
  }, []);
  
  const fetchCoachDetails = async () => {
    try {
      setLoading(true);
      const response = await coachAPI.getCoachById(coachId);
      setCoach(response.data);
    } catch (error) {
      Alert.alert('오류', '코치 정보를 불러오는데 실패했습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };
  
  const calculatePrice = (values) => {
    if (!coach) return 0;
    
    const hourlyRate = coach.pricing.hourlyRate;
    const hours = values.duration / 60;
    let price = hourlyRate * hours;
    
    // 그룹 레슨 할인율 적용
    if (values.lessonType === 'group') {
      price = price * (1 - coach.pricing.groupDiscount / 100);
    }
    
    return Math.round(price);
  };
  
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // 선택한 자녀 정보 가져오기
      const selectedChild = children.find(child => child._id === values.childId);
      
      const lessonData = {
        coach: coachId,
        childName: selectedChild.name,
        childAge: selectedChild.age,
        lessonType: values.lessonType,
        skillLevel: selectedChild.skillLevel,
        location: values.locationChoice === 'coach' ? coach.location : values.location,
        schedule: {
          date: values.lessonDate,
          startTime: values.startTime,
          duration: values.duration,
        },
        price: calculatePrice(values),
        notes: values.notes,
      };
      
      await lessonAPI.requestLesson(lessonData);
      
      Alert.alert(
        '요청 완료',
        '레슨 요청이 완료되었습니다. 코치의 응답을 기다려주세요.',
        [{ text: '확인', onPress: () => navigation.navigate('Bookings') }]
      );
    } catch (error) {
      Alert.alert('오류', '레슨 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  if (!coach) return null;
  
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-xl font-bold mb-6">{coachName} 코치에게 레슨 요청</Text>
        
        <Formik
          initialValues={{
            childId: children.length > 0 ? children[0]._id : '',
            lessonType: 'private',
            lessonDate: new Date(),
            startTime: '14:00',
            duration: 60,
            locationChoice: 'coach',
            location: {
              address: '',
              coordinates: [],
            },
            notes: '',
          }}
          validationSchema={LessonRequestSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
            // 가격 계산
            useEffect(() => {
              const price = calculatePrice(values);
              setEstimatedPrice(price);
            }, [values.lessonType, values.duration]);
            
            return (
              <View>
                {/* 자녀 선택 */}
                <View className="mb-4">
                  <Text className="mb-2 font-bold">자녀 선택</Text>
                  <Select
                    label="자녀 선택"
                    value={values.childId}
                    onValueChange={(value) => setFieldValue('childId', value)}
                    items={children.map(child => ({
                      label: `${child.name} (${child.age}세)`,
                      value: child._id,
                    }))}
                    error={touched.childId && errors.childId}
                  />
                  {children.length === 0 && (
                    <TouchableOpacity
                      className="mt-2"
                      onPress={() => navigation.navigate('Profile', { screen: 'EditChildren' })}
                    >
                      <Text className="text-purple-600">+ 자녀 추가하기</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* 레슨 유형 */}
                <View className="mb-4">
                  <Text className="mb-2 font-bold">레슨 유형</Text>
                  <RadioGroup
                    options={[
                      { label: '1:1 레슨', value: 'private' },
                      { label: '그룹 레슨', value: 'group' },
                      { label: '온라인 레슨', value: 'online' },
                    ]}
                    selectedValue={values.lessonType}
                    onValueChange={(value) => setFieldValue('lessonType', value)}
                    error={touched.lessonType && errors.lessonType}
                  />
                </View>
                
                {/* 날짜 및 시간 */}
                <View className="mb-4">
                  <Text className="mb-2 font-bold">날짜 및 시간</Text>
                  
                  <TouchableOpacity
                    className="p-3 border border-gray-300 rounded-md mb-2"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text>{format(values.lessonDate, 'PPP (EEEE)', { locale: ko })}</Text>
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={values.lessonDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue('lessonDate', selectedDate);
                        }
                      }}
                      minimumDate={new Date()}
                    />
                  )}
                  
                  <TouchableOpacity
                    className="p-3 border border-gray-300 rounded-md mb-2"
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text>{values.startTime}</Text>
                  </TouchableOpacity>
                  
                  {showTimePicker && (
                    <DateTimePicker
                      value={new Date(`2023-01-01T${values.startTime}:00`)}
                      mode="time"
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          setFieldValue('startTime', format(selectedTime, 'HH:mm'));
                        }
                      }}
                    />
                  )}
                  
                  <Select
                    label="수업 시간"
                    value={values.duration}
                    onValueChange={(value) => setFieldValue('duration', parseInt(value))}
                    items={[
                      { label: '60분', value: 60 },
                      { label: '90분', value: 90 },
                      { label: '120분', value: 120 },
                    ]}
                    error={touched.duration && errors.duration}
                  />
                </View>
                
                {/* 장소 선택 */}
                <View className="mb-4">
                  <Text className="mb-2 font-bold">장소</Text>
                  <RadioGroup
                    options={[
                      { label: '코치가 제안한 장소', value: 'coach' },
                      { label: '내가 선택한 장소', value: 'custom' },
                    ]}
                    selectedValue={values.locationChoice}
                    onValueChange={(value) => setFieldValue('locationChoice', value)}
                    error={touched.locationChoice && errors.locationChoice}
                  />
                  
                  {values.locationChoice === 'coach' ? (
                    <View className="mt-2 p-3 bg-gray-100 rounded-md">
                      <Text>{coach.location.address}</Text>
                    </View>
                  ) : (
                    <View className="mt-2">
                      <MapLocationPicker
                        initialLocation={profile?.location}
                        onLocationSelect={(location) => setFieldValue('location', location)}
                        error={
                          touched.location?.address && 
                          errors.location?.address || 
                          touched.location?.coordinates && 
                          errors.location?.coordinates
                        }
                      />
                    </View>
                  )}
                </View>
                
                {/* 요청사항 */}
                <View className="mb-4">
                  <Text className="mb-2 font-bold">요청사항 (선택)</Text>
                  <TextArea
                    placeholder="코치에게 전달할 요청사항을 입력해주세요"
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    error={touched.notes && errors.notes}
                    maxLength={500}
                  />
                </View>
                
                {/* 예상 비용 */}
                <View className="mb-6 p-4 bg-gray-100 rounded-md">
                  <Text className="mb-2 font-bold">예상 비용</Text>
                  <Text className="text-xl">{formatCurrency(estimatedPrice)}원</Text>
                </View>
                
                <Button 
                  title="레슨 요청하기" 
                  onPress={handleSubmit} 
                  loading={loading}
                />
              </View>
            );
          }}
        </Formik>
      </View>
    </ScrollView>
  );
}
```

## 7. 채팅 상세 화면

```jsx
// src/screens/common/ChatDetailScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import io from 'socket.io-client';
import { API_URL } from '../../constants/api';
import { chatAPI } from '../../api';
import { useAuthStore } from '../../stores/authStore';
import { ChatBubble, LoadingSpinner, ErrorMessage } from '../../components/chat';

export default function ChatDetailScreen() {
  const route = useRoute();
  const { chatId, name: recipientName } = route.params;
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  
  const socket = useRef(null);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // 소켓 연결 및 메시지 로드
  useEffect(() => {
    fetchMessages();
    
    // 소켓 연결
    socket.current = io(API_URL);
    
    // 채팅방 입장
    socket.current.emit('join_chat', { chatId });
    
    // 메시지 수신 이벤트
    socket.current.on('received_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    
    // 타이핑 이벤트
    socket.current.on('typing', ({ userId }) => {
      if (userId !== user._id) {
        setIsRecipientTyping(true);
      }
    });
    
    socket.current.on('stop_typing', ({ userId }) => {
      if (userId !== user._id) {
        setIsRecipientTyping(false);
      }
    });
    
    return () => {
      if (socket.current) {
        socket.current.emit('leave_chat', { chatId });
        socket.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId]);
  
  // 메시지를 가져오는 함수
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(chatId);
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('메시지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 메시지 전송 함수
  const sendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      const response = await chatAPI.sendMessage(chatId, messageText);
      const newMessage = response.data;
      
      // 소켓으로 실시간 전송
      socket.current.emit('send_message', newMessage);
      
      // 타이핑 상태 해제
      handleStopTyping();
      
      // 입력창 초기화
      setMessageText('');
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };
  
  // 타이핑 시작 이벤트
  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socket.current.emit('typing', { chatId, userId: user._id });
    }
    
    // 타이핑 타임아웃 리셋
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(handleStopTyping, 3000);
  };
  
  // 타이핑 중지 이벤트
  const handleStopTyping = () => {
    if (typing) {
      setTyping(false);
      socket.current.emit('stop_typing', { chatId, userId: user._id });
    }
  };
  
  // 메시지 그룹화 (날짜별)
  const groupMessagesByDate = () => {
    const grouped = [];
    let currentDate = null;
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        grouped.push({
          id: `date-${messageDate}`,
          type: 'date',
          date: new Date(message.createdAt),
        });
        currentDate = messageDate;
      }
      
      grouped.push({
        ...message,
        type: 'message',
      });
    });
    
    return grouped;
  };
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMessages} />;
  
  const groupedMessages = groupMessagesByDate();
  
  // 메시지 렌더링 함수
  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View className="py-2 items-center">
          <Text className="py-1 px-3 bg-gray-200 text-gray-700 text-xs rounded-full">
            {format(item.date, 'PPP', { locale: ko })}
          </Text>
        </View>
      );
    }
    
    const isMyMessage = item.sender === user._id;
    
    return (
      <ChatBubble
        message={item}
        isMyMessage={isMyMessage}
      />
    );
  };
  
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={groupedMessages}
        keyExtractor={(item) => item.id || item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isRecipientTyping ? (
            <View className="py-2 px-4 ml-2 bg-gray-200 self-start rounded-3xl my-1">
              <Text className="text-gray-700">입력 중...</Text>
            </View>
          ) : null
        }
      />
      
      <View className="p-2 border-t border-gray-200 flex-row items-center">
        <TextInput
          className="flex-1 p-3 bg-gray-100 rounded-full mr-2"
          placeholder="메시지를 입력하세요"
          value={messageText}
          onChangeText={(text) => {
            setMessageText(text);
            handleTyping();
          }}
          multiline
        />
        <TouchableOpacity
          className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center"
          onPress={sendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
```

## 8. 위치 선택 컴포넌트

```jsx
// src/components/common/MapLocationPicker.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { googleGeocode, reverseGeocode } from '../../services/locationService';

export default function MapLocationPicker({ initialLocation, onLocationSelect, error }) {
  const [region, setRegion] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [markerPosition, setMarkerPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 초기 위치 설정
  useEffect(() => {
    if (initialLocation?.coordinates?.length === 2) {
      const [longitude, latitude] = initialLocation.coordinates;
      setRegion({
        ...region,
        latitude,
        longitude,
      });
      setMarkerPosition({
        latitude,
        longitude,
      });
      setAddress(initialLocation.address);
    } else {
      getCurrentLocation();
    }
  }, []);
  
  // 위치 정보가 변경될 때 콜백 실행
  useEffect(() => {
    if (markerPosition && address) {
      onLocationSelect({
        coordinates: [markerPosition.longitude, markerPosition.latitude],
        address,
      });
    }
  }, [markerPosition, address]);
  
  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다.');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const { latitude, longitude } = location.coords;
      
      setRegion({
        ...region,
        latitude,
        longitude,
      });
      
      setMarkerPosition({
        latitude,
        longitude,
      });
      
      // 주소 가져오기
      const addressInfo = await reverseGeocode(latitude, longitude);
      if (addressInfo) {
        setAddress(addressInfo);
      }
    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error);
      Alert.alert('오류', '위치 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 주소로 위치 검색
  const searchByAddress = async () => {
    if (!address.trim()) return;
    
    try {
      setLoading(true);
      
      const location = await googleGeocode(address);
      if (location) {
        const { lat, lng } = location;
        
        setRegion({
          ...region,
          latitude: lat,
          longitude: lng,
        });
        
        setMarkerPosition({
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error('주소 검색 실패:', error);
      Alert.alert('오류', '해당 주소를 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 지도에서 위치 선택
  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    
    setMarkerPosition(coordinate);
    
    try {
      setLoading(true);
      
      // 주소 가져오기
      const addressInfo = await reverseGeocode(coordinate.latitude, coordinate.longitude);
      if (addressInfo) {
        setAddress(addressInfo);
      }
    } catch (error) {
      console.error('주소 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View className="mt-2">
      <View className="flex-row items-center mb-2">
        <TextInput
          className="flex-1 p-3 bg-gray-100 rounded-md mr-2"
          placeholder="주소 입력"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity
          className="p-2 bg-purple-600 rounded-md"
          onPress={searchByAddress}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mb-2">{error}</Text>
      )}
      
      <MapView
        className="w-full h-64 rounded-md"
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {markerPosition && (
          <Marker
            coordinate={markerPosition}
            draggable
            onDragEnd={(e) => handleMapPress(e)}
          />
        )}
      </MapView>
      
      <TouchableOpacity
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow"
        onPress={getCurrentLocation}
      >
        <Ionicons name="locate" size={24} color="#6b21ff" />
      </TouchableOpacity>
      
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 items-center justify-center">
          <ActivityIndicator size="large" color="#6b21ff" />
        </View>
      )}
    </View>
  );
}
```

## 9. Node.js 백엔드 설정 (app.js)

```javascript
// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketio = require('socket.io');
const { setupSocket } = require('./websocket/socket');

// 환경 변수 로드
dotenv.config();

// 라우트 가져오기
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const coachRoutes = require('./routes/coaches');
const lessonRoutes = require('./routes/lessons');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chats');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

// 에러 핸들러 미들웨어
const errorHandler = require('./middleware/error');

// Express 앱 초기화
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 소켓 설정
setupSocket(io);

// 데이터베이스 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 미들웨어
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());

// CORS 설정
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 요청 제한
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10분
  max: 100 // 요청 제한
});
app.use(limiter);

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 기본 경로
app.get('/', (req, res) => {
  res.send('축구레슨 매칭 플랫폼 API');
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});

// 처리되지 않은 예외 처리
process.on('unhandledRejection', (err, promise) => {
  console.log(`에러: ${err.message}`);
  // 서버 종료
  server.close(() => process.exit(1));
});
```

## 10. MongoDB 모델 (Users.js)

```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력해주세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요'],
    minlength: 6,
    select: false
  },
  name: {
    type: String,
    required: [true, '이름을 입력해주세요']
  },
  role: {
    type: String,
    enum: ['parent', 'coach', 'admin'],
    default: 'parent'
  },
  phone: {
    type: String,
    required: [true, '전화번호를 입력해주세요'],
    match: [/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/, '유효한 전화번호를 입력해주세요']
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 비밀번호 암호화
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JWT 토큰 생성
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// 비밀번호 확인
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 비밀번호 재설정 토큰 생성
UserSchema.methods.getResetPasswordToken = function() {
  // 랜덤 토큰 생성
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 토큰 해시
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 만료 시간 설정 (10분)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
```

## 11. 백엔드 라우트 (coaches.js)

```javascript
// src/routes/coaches.js
const express = require('express');
const router = express.Router();
const {
  getCoaches,
  getCoach,
  createCoachProfile,
  updateCoachProfile,
  uploadCertification,
  uploadGalleryImage,
  deleteGalleryImage,
  getNearbyCoaches,
} = require('../controllers/coachController');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Coach = require('../models/Coach');

// 파일 업로드 미들웨어
const fileUpload = require('../middleware/upload');

// 코치 목록 및 생성
router
  .route('/')
  .get(advancedResults(Coach, 'user'), getCoaches)
  .post(protect, authorize('coach'), createCoachProfile);

// 주변 코치 검색
router.route('/nearby').get(getNearbyCoaches);

// 특정 코치 조회 및 업데이트
router
  .route('/:id')
  .get(getCoach)
  .put(protect, authorize('coach', 'admin'), updateCoachProfile);

// 자격증 업로드
router
  .route('/:id/certifications')
  .post(
    protect,
    authorize('coach'),
    fileUpload.single('image'),
    uploadCertification
  );

// 갤러리 이미지 업로드
router
  .route('/:id/gallery')
  .post(
    protect,
    authorize('coach'),
    fileUpload.single('image'),
    uploadGalleryImage
  );

// 갤러리 이미지 삭제
router
  .route('/:id/gallery/:imageId')
  .delete(protect, authorize('coach', 'admin'), deleteGalleryImage);

module.exports = router;
```

## 12. 백엔드 컨트롤러 (authController.js)

```javascript
// src/controllers/authController.js
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    회원가입
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  // 사용자 생성
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone
  });

  sendTokenResponse(user, 201, res);
});

// @desc    로그인
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 이메일과 비밀번호 확인
  if (!email || !password) {
    return next(new ErrorResponse('이메일과 비밀번호를 입력해주세요', 400));
  }

  // 사용자 확인
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('유효하지 않은 이메일 또는 비밀번호입니다', 401));
  }

  // 비밀번호 확인
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('유효하지 않은 이메일 또는 비밀번호입니다', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    로그아웃
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    현재 로그인한 사용자 정보
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    비밀번호 변경
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // 현재 비밀번호 확인
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('현재 비밀번호가 일치하지 않습니다', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    비밀번호 재설정 요청
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('해당 이메일로 등록된 사용자가 없습니다', 404));
  }

  // 재설정 토큰 생성
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // 재설정 URL 생성
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  const message = `비밀번호 재설정 요청을 받았습니다. 비밀번호를 재설정하시려면 다음 링크를 클릭해주세요: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: '비밀번호 재설정 링크',
      message
    });

    res.status(200).json({ success: true, data: '이메일이 전송되었습니다' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('이메일을 보낼 수 없습니다', 500));
  }
});

// @desc    비밀번호 재설정
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 토큰 해시
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('유효하지 않은 토큰입니다', 400));
  }

  // 새 비밀번호 설정
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// JWT 토큰 생성 및 쿠키에 저장
const sendTokenResponse = (user, statusCode, res) => {
  // 토큰 생성
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified
      }
    });
};
```