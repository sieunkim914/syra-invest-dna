import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { BottomTabBar } from './components/BottomTabBar';
import { ChatTab } from './components/ChatTab';
import { ProfileTab } from './components/ProfileTab';
import { Screen1Home } from './components/Screen1Home';
import { Screen2Input } from './components/Screen2Input';
import { Screen3Result } from './components/Screen3Result';
import { Screen4Chat } from './components/Screen4Chat';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-[390px] min-h-[844px] bg-white shadow-2xl relative flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Screen1Home />} />
              <Route path="/input" element={<Screen2Input />} />
              <Route path="/result" element={<Screen3Result />} />
              <Route path="/chat" element={<Screen4Chat />} />
              <Route path="/chat-tab" element={<ChatTab />} />
              <Route path="/profile" element={<ProfileTab />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <BottomTabBar />
        </div>
      </div>
    </BrowserRouter>
  );
}
