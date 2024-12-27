import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // อัปเดตสถานะเพื่อให้แสดง UI สำรอง
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // คุณสามารถบันทึกข้อผิดพลาดที่นี่ เช่น ส่งไปยังเซิร์ฟเวอร์
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // คุณสามารถแสดง UI สำรองได้ที่นี่
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary; 