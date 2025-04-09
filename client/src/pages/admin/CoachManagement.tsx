import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search as SearchIcon, 
  CheckCircle, 
  XCircle, 
  Eye as EyeIcon, 
  RefreshCcw 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { requireAuth } from '@/lib/auth';

// Coach 인터페이스 정의
interface Coach {
  id: number;
  userId: number;
  name: string;
  email: string;
  bio: string;
  specializations: string[];
  experience: string;
  status: 'pending' | 'approved' | 'rejected' | 'social_pending';
  createdAt: string;
  rejectionReason?: string | null;
  profileImage?: string;
  user: {
    email: string;
    username: string;
    isCoach: boolean;
    socialProvider?: string;
    socialId?: string;
  }
}

// 코치 관리 페이지 컴포넌트
export function CoachManagement() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState<boolean>(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<boolean>(false);
  
  // 코치 데이터 가져오기
  const { data: coaches = [], isLoading, error } = useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const res = await fetch('/api/admin/coaches');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '코치 정보를 가져오는데 실패했습니다.');
      }
      return res.json();
    }
  });
  
  // 코치 상태 업데이트 뮤테이션
  const updateCoachStatus = useMutation({
    mutationFn: async ({ coachId, status, reason }: { coachId: number, status: string, reason?: string }) => {
      const res = await fetch(`/api/admin/coaches/${coachId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '코치 상태 업데이트에 실패했습니다.');
      }
      
      return res.json();
    },
    onSuccess: () => {
      // 코치 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      setRejectionReason('');
      setRejectDialogOpen(false);
      
      toast.success('코치 상태가 업데이트되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(`오류: ${error.message}`);
    }
  });
  
  // 관리자 권한 확인
  const isAdmin = window.localStorage.getItem('isAdmin') === 'true';
  
  if (!isAdmin) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>접근 권한 없음</CardTitle>
            <CardDescription>이 페이지는 관리자만 접근할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // 검색 및 필터링 함수
  const filteredCoaches = coaches.filter((coach: Coach) => {
    // 검색어 필터링
    const searchInCoach = 
      coach.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coach.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 탭 필터링
    if (activeTab === 'all') return searchInCoach;
    return coach.status === activeTab && searchInCoach;
  });
  
  // 코치 승인 핸들러
  const handleApprove = (coach: Coach) => {
    updateCoachStatus.mutate({ coachId: coach.id, status: 'approved' });
  };
  
  // 코치 거절 다이얼로그 열기
  const openRejectDialog = (coach: Coach) => {
    setSelectedCoach(coach);
    setRejectDialogOpen(true);
  };
  
  // 코치 거절 제출 핸들러
  const handleReject = () => {
    if (!selectedCoach) return;
    
    updateCoachStatus.mutate({ 
      coachId: selectedCoach.id, 
      status: 'rejected', 
      reason: rejectionReason 
    });
  };
  
  // 코치 상세 정보 다이얼로그 열기
  const openDetailsDialog = (coach: Coach) => {
    setSelectedCoach(coach);
    setDetailsDialogOpen(true);
  };
  
  // 상태 배지 렌더링 함수
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="destructive">거절됨</Badge>;
      case 'social_pending':
        return <Badge variant="warning">소셜 계정 심사중</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">심사중</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>코치 관리</CardTitle>
          <CardDescription>코치 신청 내역 및 관리</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 검색 및 필터링 */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-72">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름, 이메일 또는 소개 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="pending">심사중</TabsTrigger>
                <TabsTrigger value="approved">승인됨</TabsTrigger>
                <TabsTrigger value="rejected">거절됨</TabsTrigger>
                <TabsTrigger value="social_pending">소셜 계정</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* 코치 목록 테이블 */}
          <Table>
            <TableCaption>총 {filteredCoaches.length}명의 코치 신청이 있습니다.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">프로필</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>전문 분야</TableHead>
                <TableHead>신청일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex items-center justify-center py-4">
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      코치 정보를 불러오는 중...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCoaches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchQuery ? '검색 결과가 없습니다.' : '코치 신청 내역이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoaches.map((coach: Coach) => (
                  <TableRow key={coach.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        {coach.profileImage ? (
                          <img src={coach.profileImage} alt={coach.user.username} />
                        ) : (
                          <div className="bg-primary text-white font-bold flex items-center justify-center h-full">
                            {coach.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                    </TableCell>
                    <TableCell>{coach.user.username}</TableCell>
                    <TableCell>{coach.user.email}</TableCell>
                    <TableCell>
                      {coach.specializations && coach.specializations.length > 0 ? (
                        coach.specializations.join(', ')
                      ) : (
                        <span className="text-muted-foreground">미설정</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(coach.createdAt), 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell>{renderStatusBadge(coach.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(coach)}>
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {coach.status === 'pending' || coach.status === 'social_pending' ? (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleApprove(coach)}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openRejectDialog(coach)}>
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* 코치 상세 정보 다이얼로그 */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedCoach && (
            <>
              <DialogHeader>
                <DialogTitle>코치 상세 정보</DialogTitle>
                <DialogDescription>
                  {selectedCoach.user.username}님의 코치 신청 정보입니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">이름</Label>
                  <div className="col-span-3">{selectedCoach.user.username}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">이메일</Label>
                  <div className="col-span-3">{selectedCoach.user.email}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">소셜 계정</Label>
                  <div className="col-span-3">
                    {selectedCoach.user.socialProvider ? (
                      <>{selectedCoach.user.socialProvider} ({selectedCoach.user.socialId})</>
                    ) : (
                      <span className="text-muted-foreground">없음</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">전문 분야</Label>
                  <div className="col-span-3">
                    {selectedCoach.specializations?.length > 0 ? (
                      selectedCoach.specializations.map((spec, idx) => (
                        <Badge key={idx} className="mr-1 mb-1">{spec}</Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">미설정</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">소개</Label>
                  <div className="col-span-3 whitespace-pre-line">
                    {selectedCoach.bio || <span className="text-muted-foreground">소개 정보가 없습니다.</span>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">경력</Label>
                  <div className="col-span-3 whitespace-pre-line">
                    {selectedCoach.experience || <span className="text-muted-foreground">경력 정보가 없습니다.</span>}
                  </div>
                </div>
                {selectedCoach.status === 'rejected' && selectedCoach.rejectionReason && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right">거절 사유</Label>
                    <div className="col-span-3 text-red-500 whitespace-pre-line">
                      {selectedCoach.rejectionReason}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                  닫기
                </Button>
                {selectedCoach.status === 'pending' || selectedCoach.status === 'social_pending' ? (
                  <>
                    <Button variant="destructive" onClick={() => {
                      setDetailsDialogOpen(false);
                      openRejectDialog(selectedCoach);
                    }}>
                      거절
                    </Button>
                    <Button onClick={() => {
                      setDetailsDialogOpen(false);
                      handleApprove(selectedCoach);
                    }}>
                      승인
                    </Button>
                  </>
                ) : null}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 코치 거절 다이얼로그 */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>코치 신청 거절</DialogTitle>
            <DialogDescription>
              {selectedCoach?.user.username}님의 코치 신청을 거절합니다. 거절 사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="rejection-reason" className="text-right">
                거절 사유
              </Label>
              <Textarea
                id="rejection-reason"
                className="col-span-3"
                placeholder="거절 사유를 입력해주세요."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              거절하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default requireAuth(CoachManagement); 